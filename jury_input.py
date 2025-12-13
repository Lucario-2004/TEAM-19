import tkinter as tk
from tkinter import messagebox
import json

class JuryInterface:
    def __init__(self, root):
        self.root = root
        self.root.title("Agri Twin - Jury Seeding Interface")
        
        # Configuration
        self.GRID_SIZE = 10
        self.MAX_SELECTIONS = 15
        self.selected_spots = []
        self.buttons = {}

        # UI Layout
        self.create_header()
        self.create_grid()
        self.create_footer()

    def create_header(self):
        header_frame = tk.Frame(self.root, pady=10)
        header_frame.pack()
        
        tk.Label(header_frame, text="🌱 Agri Twin Simulation Setup", font=("Arial", 16, "bold")).pack()
        self.status_label = tk.Label(
            header_frame, 
            text=f"Please select {self.MAX_SELECTIONS} spots to infect.", 
            fg="blue",
            font=("Arial", 12)
        )
        self.status_label.pack()

    def create_grid(self):
        grid_frame = tk.Frame(self.root, padx=20, pady=20)
        grid_frame.pack()

        for row in range(self.GRID_SIZE):
            for col in range(self.GRID_SIZE):
                btn = tk.Button(
                    grid_frame, 
                    width=4, 
                    height=2, 
                    bg="#90EE90", # Light Green (Healthy)
                    command=lambda r=row, c=col: self.toggle_spot(r, c)
                )
                btn.grid(row=row, column=col, padx=2, pady=2)
                self.buttons[(row, col)] = btn

    def create_footer(self):
        footer_frame = tk.Frame(self.root, pady=10)
        footer_frame.pack()
        
        save_btn = tk.Button(
            footer_frame, 
            text="SAVE CONFIGURATION & LAUNCH", 
            bg="black", 
            fg="white", 
            font=("Arial", 12, "bold"),
            command=self.save_data
        )
        save_btn.pack()

    def toggle_spot(self, row, col):
        coord = {"row": row, "col": col}
        
        # If already selected, deselect it
        if coord in self.selected_spots:
            self.selected_spots.remove(coord)
            self.buttons[(row, col)].config(bg="#90EE90") # Back to Green
            
        # If not selected, check limit then select
        elif len(self.selected_spots) < self.MAX_SELECTIONS:
            self.selected_spots.append(coord)
            self.buttons[(row, col)].config(bg="#FF6347") # Tomato Red (Infected)
            
        else:
            messagebox.showwarning("Limit Reached", f"You can only select {self.MAX_SELECTIONS} spots!")

        # Update label
        count = len(self.selected_spots)
        self.status_label.config(text=f"Selected: {count} / {self.MAX_SELECTIONS}")

    def save_data(self):
        if len(self.selected_spots) != self.MAX_SELECTIONS:
            messagebox.showerror("Error", f"Please select exactly {self.MAX_SELECTIONS} spots.")
            return

        data = {
            "grid_size": self.GRID_SIZE,
            "defective_spots": self.selected_spots
        }

        # Save to JSON file
        try:
            with open("field_config.json", "w") as f:
                json.dump(data, f, indent=4)
            messagebox.showinfo("Success", "Field Configuration Saved!\nReady for Simulation.")
            self.root.destroy() # Close the window
        except Exception as e:
            messagebox.showerror("File Error", str(e))

if __name__ == "__main__":
    root = tk.Tk()
    app = JuryInterface(root)
    root.mainloop()