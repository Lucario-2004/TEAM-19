import json
import random
import os
import time
import sys
import subprocess
from ursina import *
import tkinter as tk

# --- 1. FILE SYSTEM & ASSET LOADING ---
HEALTHY_DIR = "healthy crops"
UNHEALTHY_DIR = "unhealthy crops"
CONFIG_FILE = "field_config.json"

def get_images_from_folder(folder_path):
    if not os.path.exists(folder_path):
        return ["placeholder.png"] 
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    if not files: return ["placeholder.png"]
    return files

healthy_images = get_images_from_folder(HEALTHY_DIR)
unhealthy_images = get_images_from_folder(UNHEALTHY_DIR)

# --- 2. LOAD JURY CONFIGURATION ---
def load_jury_config():
    if not os.path.exists(CONFIG_FILE): return set()
    with open(CONFIG_FILE, 'r') as f:
        data = json.load(f)
        return {(item['row'], item['col']) for item in data['defective_spots']}

jury_selected_spots = load_jury_config()

# --- 3. URSINA APP SETUP ---
app = Ursina()
window.title = "AGRO-TWIN: Digital Twin Simulation"
window.color = color.black
window.borderless = False
window.fullscreen = False

# --- 4. THE 3D FIELD GENERATION ---
ground = Entity(
    model='plane', scale=(120, 1, 120), color=color.rgb(20, 20, 20), 
    texture='grid', texture_scale=(10,10), collider='box'
)

crops = []
start_offset = -45; spacing = 10

for row in range(10):
    for col in range(10):
        x_pos = start_offset + (col * spacing)
        z_pos = start_offset + (row * spacing)
        
        if (row, col) in jury_selected_spots:
            is_defective = True; img = random.choice(unhealthy_images); folder = UNHEALTHY_DIR
        else:
            is_defective = False; img = random.choice(healthy_images); folder = HEALTHY_DIR
            
        plant = Entity(model='cube', position=(x_pos, 0, z_pos), scale=(1, 3, 1), color=color.green, texture='white_cube', collider='box')
        foliage = Entity(parent=plant, model='sphere', y=0.5, scale=(1.5, 0.5, 1.5), color=color.green, texture='grass')
        
        plant.is_defective = is_defective
        plant.image_name = img
        plant.folder_path = folder
        plant.grid_coords = (row, col)
        crops.append(plant)

bot = Entity(model='cube', color=color.cyan, scale=(2, 2, 2), y=1, position=(0, 1, 0))
PointLight(parent=bot, color=color.cyan, range=15)

# --- 5. IMAGE PANEL ---
image_panel = Entity(
    parent=camera.ui, model='quad', scale=(0.5, 0.5), position=(0, 0),
    color=color.white, texture='white_cube', enabled=False
)

def close_ursina_panel():
    image_panel.enabled = False
    mouse.locked = True

# --- 6. TKINTER POPUP & TRANSITION LOGIC ---
def open_details_popup(data):
    root = tk.Tk()
    root.title("AGRO-TWIN Report")
    
    # Center Window
    sw = root.winfo_screenwidth(); sh = root.winfo_screenheight()
    root.geometry(f"400x480+{int((sw-400)/2)}+{int((sh-480)/2)}")
    root.configure(bg="#f0f0f0")
    
    tk.Label(root, text="CROP ANALYSIS RESULT", font=("Helvetica", 16, "bold"), bg="#f0f0f0", fg="#333").pack(pady=15)

    def create_row(label, value, col="black"):
        f = tk.Frame(root, bg="#f0f0f0"); f.pack(fill="x", padx=30, pady=5)
        tk.Label(f, text=label, font=("Arial", 10, "bold"), width=15, anchor="w", bg="#f0f0f0", fg="#555").pack(side="left")
        tk.Label(f, text=value, font=("Arial", 11), fg=col, anchor="w", bg="#f0f0f0").pack(side="left")

    status_color = "#d9534f" if "DEFECTIVE" in data['status'] else "#5cb85c"
    create_row("Bot Location:", data['location'])
    create_row("Health Status:", data['status'], status_color)
    create_row("Crop Type:", data['crop'])
    create_row("Disease Detected:", data['disease'])
    
    tk.Frame(root, height=2, bd=1, relief="sunken").pack(fill="x", padx=20, pady=15)
    
    # --- RESUME BUTTON ---
    tk.Button(root, text="RESUME SIMULATION", bg="#555", fg="white", command=root.destroy).pack(fill="x", padx=40, pady=5)

    # --- NEXT BUTTON (FIXED) ---
    def launch_expert_ai():
        # 1. Save Data
        session_data = {"crop": data['crop'], "disease": data['disease'], "status": data['status']}
        with open("current_session.json", "w") as f:
            json.dump(session_data, f)
            
        print("Launching Chatbot...")
        
        # 2. Launch Chatbot INDEPENDENTLY using sys.executable
        # This uses the exact same python.exe that is running this script
        subprocess.Popen([sys.executable, "agrotwin_chat.py"])
        
        # 3. FORCE KILL this simulation script
        # root.destroy() isn't enough; we need to kill the process to close the Ursina window
        os._exit(0) 

    tk.Button(
        root, text="NEXT: CONSULT AI EXPERT ➤", bg="#0275d8", fg="white", 
        font=("Arial", 11, "bold"), pady=10, command=launch_expert_ai
    ).pack(fill="x", padx=40, pady=(10, 20))

    root.mainloop()
    close_ursina_panel()

def open_scan_sequence(plant):
    filename_clean = os.path.splitext(plant.image_name)[0]
    if '-' in filename_clean:
        parts = filename_clean.split('-', 1)
        crop_name = parts[0].capitalize()
        if not plant.is_defective:
            disease_name = "None (Healthy)"; status_str = "HEALTHY"
        else:
            disease_name = parts[1].replace('_', ' ').title(); status_str = "DEFECTIVE / UNHEALTHY"
    else:
        crop_name = "Unknown"; disease_name = "Unknown"; status_str = "UNKNOWN STATUS"

    scan_data = {
        "location": f"X:{int(bot.x)} | Z:{int(bot.z)}",
        "status": status_str, "crop": crop_name, "disease": disease_name,
    }

    full_path = os.path.join(plant.folder_path, plant.image_name)
    tex = load_texture(full_path)
    if tex:
        aspect = tex.width / tex.height
        image_panel.scale = (0.6, 0.6 / aspect)
        image_panel.texture = tex
        image_panel.enabled = True
    
    mouse.locked = False 
    invoke(open_details_popup, scan_data, delay=0.1)

# --- 7. MAIN LOOP ---
camera.position = (0, 70, -90); camera.rotation_x = 45

def update():
    camera.x = bot.x; camera.z = bot.z - 50
    if not image_panel.enabled:
        speed = 20 * time.dt
        if held_keys['w']: bot.z += speed
        if held_keys['s']: bot.z -= speed
        if held_keys['a']: bot.x -= speed
        if held_keys['d']: bot.x += speed
        for plant in crops:
            if distance(bot, plant) < 5.0:
                plant.children[0].color = color.yellow
                if held_keys['space']: open_scan_sequence(plant)
            else:
                plant.children[0].color = color.green

if __name__ == "__main__":
    app.run()