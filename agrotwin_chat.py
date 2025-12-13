import tkinter as tk
from tkinter import ttk, scrolledtext
import google.generativeai as genai
import json
import os
import sys
import difflib # For NLP matching

# --- CONFIGURATION ---
API_KEY = "AIzaSyAiZiYHCZdpUUxsYP-WYND5bq3DIdF_iWs"
LEARNING_DB_FILE = "agent_learning_db.json"
SESSION_FILE = "current_session.json"

# Configure Gemini
genai.configure(api_key=API_KEY)

# --- THE AGENT BRAIN (Regression Learning & CAG) ---
class AgroTwinAgent:
    def __init__(self):
        self.context = self.load_session_context()
        self.knowledge_base = self.load_learning_db()
        self.conversation_history = []
        
        # CAG: Continuous Context System Prompt
        self.system_prompt = f"""
        You are AGRO-TWIN, an advanced agricultural AI agent.
        CURRENT CONTEXT:
        Crop: {self.context.get('crop', 'Unknown')}
        Condition: {self.context.get('disease', 'Unknown')}
        Status: {self.context.get('status', 'Unknown')}
        
        Instructions:
        1. Answer specifically for the crop and disease mentioned above.
        2. Be concise, empathetic, and scientific.
        3. If the status is HEALTHY, advise on maintenance.
        4. If DISEASED, advise on treatment.
        """

    def load_session_context(self):
        """Loads the disease data passed from the 3D simulation."""
        if os.path.exists(SESSION_FILE):
            with open(SESSION_FILE, 'r') as f:
                return json.load(f)
        return {"crop": "Generic", "disease": "None", "status": "Unknown"}

    def load_learning_db(self):
        """
        Loads the question dictionary. 
        If it exists, load the 'learned' weights.
        If not, initialize with default questions and weight 0.5.
        """
        default_kb = {
            "1️⃣ Core Questions": [
                {"q": "What is the problem with this crop?", "weight": 0.9},
                {"q": "Is this a serious problem?", "weight": 0.8},
            ],
            "2️⃣ Pesticide Selection": [
                {"q": "What pesticide should I use?", "weight": 0.7},
                {"q": "Is there an organic alternative?", "weight": 0.6},
            ],
            "3️⃣ Dosage (Regression Model)": [
                {"q": "What is the correct dosage per acre?", "weight": 0.5},
                {"q": "Will using more damage the crop?", "weight": 0.5},
            ],
            "4️⃣ Application Method": [
                {"q": "When is the best time to spray?", "weight": 0.5},
                {"q": "Should I spray leaves or soil?", "weight": 0.5},
            ]
        }
        
        if os.path.exists(LEARNING_DB_FILE):
            try:
                with open(LEARNING_DB_FILE, 'r') as f:
                    return json.load(f)
            except:
                return default_kb
        return default_kb

    def save_learning_db(self):
        """Persists the learned weights to JSON."""
        with open(LEARNING_DB_FILE, 'w') as f:
            json.dump(self.knowledge_base, f, indent=4)

    def regression_update(self, category, question_text):
        """
        ALGORITHM: Reinforcement/Regression Update
        Increases the weight of a question when it is asked.
        W_new = W_old + (Learning_Rate * (1 - W_old))
        This ensures weights approach 1.0 but never exceed it.
        """
        learning_rate = 0.1
        
        # Find the question and update weight
        for q_obj in self.knowledge_base[category]:
            if q_obj["q"] == question_text:
                old_w = q_obj["weight"]
                new_w = old_w + (learning_rate * (1.0 - old_w))
                q_obj["weight"] = new_w
                print(f"[AGENT LEARNING] Updated '{question_text}' weight: {old_w:.2f} -> {new_w:.2f}")
                break
        
        # Re-sort the list based on new regression weights (Highest first)
        self.knowledge_base[category].sort(key=lambda x: x['weight'], reverse=True)
        self.save_learning_db()

    def nlp_match(self, user_text):
        """
        Uses Sequence Matching to see if user input matches a known question.
        If match > 80%, we trigger the learning algorithm for that question.
        """
        best_ratio = 0
        best_cat = None
        best_q = None

        for cat, questions in self.knowledge_base.items():
            for q_obj in questions:
                ratio = difflib.SequenceMatcher(None, user_text.lower(), q_obj['q'].lower()).ratio()
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_cat = cat
                    best_q = q_obj['q']
        
        if best_ratio > 0.8: # 80% confidence threshold
            self.regression_update(best_cat, best_q)

    def generate_response(self, user_input):
        """CAG: Combines System Context + History + New Input"""
        
        # 1. NLP Check (Did they ask a known question?)
        self.nlp_match(user_input)

        # 2. Build History String
        history_str = "\n".join([f"User: {h[0]}\nBot: {h[1]}" for h in self.conversation_history[-3:]])
        
        # 3. Construct Final Prompt
        full_prompt = f"{self.system_prompt}\n\nRecent History:\n{history_str}\n\nFarmer: {user_input}\nAGRO-TWIN:"
        
        try:
            model = genai.GenerativeModel('gemini-pro')
            response = model.generate_content(full_prompt)
            reply = response.text
            
            # Update History
            self.conversation_history.append((user_input, reply))
            return reply
        except Exception as e:
            return f"⚠️ Connection Error: {str(e)}"

# --- GUI IMPLEMENTATION ---
class ChatbotGUI:
    def __init__(self, root):
        self.root = root
        self.agent = AgroTwinAgent()
        
        self.root.title(f"AGRO-TWIN EXPERT | Analyzing: {self.agent.context['crop']}")
        self.root.geometry("900x700")
        self.root.configure(bg="#1a1a1a")

        self.create_layout()

    def create_layout(self):
        # 1. Header
        header = tk.Label(
            self.root, 
            text=f"DETECTED: {self.agent.context['disease'].upper()}", 
            bg="#d9534f" if "DEFECTIVE" in self.agent.context['status'] else "#5cb85c",
            fg="white", font=("Arial", 14, "bold"), pady=10
        )
        header.pack(fill="x")

        # 2. Main Container (Split Left/Right)
        main_frame = tk.Frame(self.root, bg="#1a1a1a")
        main_frame.pack(fill="both", expand=True, padx=10, pady=10)

        # --- LEFT: CHAT AREA ---
        chat_frame = tk.Frame(main_frame, bg="#1a1a1a", width=500)
        chat_frame.pack(side="left", fill="both", expand=True)

        self.chat_display = scrolledtext.ScrolledText(
            chat_frame, bg="#2b2b2b", fg="white", font=("Segoe UI", 11), wrap="word"
        )
        self.chat_display.pack(fill="both", expand=True, pady=(0, 10))
        self.chat_display.insert(tk.END, "AGRO-TWIN: Hello! I have analyzed the crop. Select a question on the right or type your own.\n\n")

        input_frame = tk.Frame(chat_frame, bg="#1a1a1a")
        input_frame.pack(fill="x")

        self.entry = tk.Entry(input_frame, bg="#333", fg="white", font=("Arial", 12))
        self.entry.pack(side="left", fill="x", expand=True, padx=(0, 5))
        self.entry.bind("<Return>", self.handle_send)

        send_btn = tk.Button(input_frame, text="SEND", command=self.handle_send, bg="#007acc", fg="white", font=("Arial", 10, "bold"))
        send_btn.pack(side="right")

        # --- RIGHT: INTELLIGENT SUGGESTIONS (The Agent's Knowledge) ---
        suggestion_frame = tk.Frame(main_frame, bg="#222", width=300)
        suggestion_frame.pack(side="right", fill="y", padx=(10, 0))
        
        tk.Label(suggestion_frame, text="RECOMMENDED QUESTIONS", bg="#222", fg="#aaa", font=("Arial", 10, "bold")).pack(pady=5)
        
        # Scrollable Canvas for buttons
        canvas = tk.Canvas(suggestion_frame, bg="#222", highlightthickness=0)
        scrollbar = ttk.Scrollbar(suggestion_frame, orient="vertical", command=canvas.yview)
        self.scrollable_frame = tk.Frame(canvas, bg="#222")

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        self.refresh_suggestions()

    def refresh_suggestions(self):
        """Redraws the buttons. Because of Regression Learning, the order changes dynamically."""
        # Clear old buttons
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()

        # Create new buttons based on current Knowledge Base weights
        for category, questions in self.agent.knowledge_base.items():
            # Category Header
            tk.Label(self.scrollable_frame, text=category, bg="#222", fg="#00aaff", font=("Arial", 9, "bold"), anchor="w").pack(fill="x", pady=(10, 2))
            
            # Questions (Sorted by weight in agent class)
            for q_data in questions:
                q_text = q_data['q']
                weight = q_data['weight']
                
                # Visual cue for highly learned questions
                bg_color = "#333"
                if weight > 0.8: bg_color = "#445500" # Golden tint for popular questions
                
                btn = tk.Button(
                    self.scrollable_frame, 
                    text=f"{q_text}", 
                    anchor="w", justify="left",
                    bg=bg_color, fg="white", 
                    font=("Arial", 9),
                    bd=0, padx=10, pady=5,
                    command=lambda q=q_text, c=category: self.handle_suggestion_click(c, q)
                )
                btn.pack(fill="x", pady=1)

    def handle_suggestion_click(self, category, question):
        """User clicked a preset."""
        # 1. Update Agent Learning (Regression)
        self.agent.regression_update(category, question)
        # 2. Refresh UI (to show new sorting)
        self.refresh_suggestions()
        # 3. Process Chat
        self.process_query(question)

    def handle_send(self, event=None):
        """User typed manually."""
        query = self.entry.get()
        if query.strip():
            self.process_query(query)
            self.entry.delete(0, tk.END)

    def process_query(self, query):
        # Display User Msg
        self.chat_display.insert(tk.END, f"\nFarmer: {query}\n", "user")
        self.chat_display.see(tk.END)
        
        # Get AI Response (Non-blocking usually, but simple here)
        self.root.update() # Force UI update before API call
        response = self.agent.generate_response(query)
        
        # Display AI Msg
        self.chat_display.insert(tk.END, f"AGRO-TWIN: {response}\n", "bot")
        self.chat_display.see(tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    app = ChatbotGUI(root)
    root.mainloop()