import json
import random
import os
import time
from ursina import *
import tkinter as tk  # Importing standard Python windowing library

# --- 1. FILE SYSTEM & ASSET LOADING ---
HEALTHY_DIR = "healthy crops"
UNHEALTHY_DIR = "unhealthy crops"
CONFIG_FILE = "field_config.json"

def get_images_from_folder(folder_path):
    """Safely loads images from a directory."""
    if not os.path.exists(folder_path):
        print(f"Warning: Folder '{folder_path}' not found. Using placeholders.")
        return ["placeholder.png"] 
    
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not files:
        print(f"Warning: No images found in '{folder_path}'.")
        return ["placeholder.png"]
        
    return files

# Load image lists
healthy_images = get_images_from_folder(HEALTHY_DIR)
unhealthy_images = get_images_from_folder(UNHEALTHY_DIR)

# --- 2. LOAD JURY CONFIGURATION ---
def load_jury_config():
    """Reads the JSON file to find where defective crops are located."""
    if not os.path.exists(CONFIG_FILE):
        print("Config file not found. Assuming clean field.")
        return set()
    
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
    model='plane', 
    scale=(120, 1, 120), 
    color=color.rgb(20, 20, 20), 
    texture='grid', 
    texture_scale=(10,10), 
    collider='box'
)

crops = []
start_offset = -45
spacing = 10

# Create the 10x10 Grid
for row in range(10):
    for col in range(10):
        x_pos = start_offset + (col * spacing)
        z_pos = start_offset + (row * spacing)
        
        if (row, col) in jury_selected_spots:
            is_defective = True
            img = random.choice(unhealthy_images)
            folder = UNHEALTHY_DIR
        else:
            is_defective = False
            img = random.choice(healthy_images)
            folder = HEALTHY_DIR
            
        plant = Entity(
            model='cube', 
            position=(x_pos, 0, z_pos), 
            scale=(1, 3, 1), 
            color=color.green, 
            texture='white_cube', 
            collider='box'
        )
        
        foliage = Entity(
            parent=plant, 
            model='sphere', 
            y=0.5, 
            scale=(1.5, 0.5, 1.5), 
            color=color.green, 
            texture='grass'
        )
        
        plant.is_defective = is_defective
        plant.image_name = img
        plant.folder_path = folder
        plant.grid_coords = (row, col)
        
        crops.append(plant)

# --- 5. THE BOT ---
bot = Entity(
    model='cube', 
    color=color.cyan, 
    scale=(2, 2, 2), 
    y=1, 
    position=(0, 1, 0)
)
PointLight(parent=bot, color=color.cyan, range=15)

# --- 6. URSINA VISUALS: IMAGE DISPLAY ---
image_panel = Entity(
    parent=camera.ui,
    model='quad',
    scale=(0.5, 0.5),
    position=(0, 0),
    color=color.white,
    texture='white_cube',
    enabled=False
)

def close_ursina_panel():
    """Hides the image panel and unlocks the mouse."""
    image_panel.enabled = False
    mouse.locked = True

# --- 7. TKINTER DATA POPUP ---
def open_details_popup(data):
    """Opens a standard Windows popup with the text details."""
    root = tk.Tk()
    root.title("AGRO-TWIN Report")
    
    # Center the window
    screen_width = root.winfo_screenwidth()
    screen_height = root.winfo_screenheight()
    x_c = int((screen_width/2) - (400/2))
    y_c = int((screen_height/2) - (350/2))
    root.geometry(f"400x350+{x_c}+{y_c}")
    
    root.configure(bg="#f0f0f0")
    
    tk.Label(root, text="CROP ANALYSIS RESULT", font=("Helvetica", 16, "bold"), bg="#f0f0f0", fg="#333").pack(pady=15)

    def create_row(label, value, value_color="black"):
        frame = tk.Frame(root, bg="#f0f0f0")
        frame.pack(fill="x", padx=30, pady=5)
        lbl = tk.Label(frame, text=label, font=("Arial", 10, "bold"), width=15, anchor="w", bg="#f0f0f0", fg="#555")
        lbl.pack(side="left")
        val = tk.Label(frame, text=value, font=("Arial", 11), fg=value_color, anchor="w", bg="#f0f0f0")
        val.pack(side="left")

    status_color = "#d9534f" if "DEFECTIVE" in data['status'] else "#5cb85c"

    create_row("Bot Location:", data['location'])
    create_row("Health Status:", data['status'], status_color)
    create_row("Crop Type:", data['crop'])
    create_row("Disease Detected:", data['disease'])
    
    tk.Frame(root, height=2, bd=1, relief="sunken").pack(fill="x", padx=20, pady=15)
    
    close_btn = tk.Button(
        root, 
        text="CLOSE & CONTINUE", 
        bg="#0275d8", 
        fg="white", 
        font=("Arial", 10, "bold"), 
        padx=10, 
        pady=5,
        command=root.destroy
    )
    close_btn.pack(pady=5)

    # This pauses the script until the window closes
    root.mainloop()
    
    # Resume Ursina
    close_ursina_panel()


def open_scan_sequence(plant):
    # Parse Data
    filename_clean = os.path.splitext(plant.image_name)[0]
    
    if '-' in filename_clean:
        parts = filename_clean.split('-', 1)
        crop_name = parts[0].capitalize()
        if not plant.is_defective:
            disease_name = "None (Healthy)"
            status_str = "HEALTHY"
        else:
            disease_name = parts[1].replace('_', ' ').title()
            status_str = "DEFECTIVE / UNHEALTHY"
    else:
        crop_name = "Unknown"
        disease_name = "Unknown"
        status_str = "UNKNOWN STATUS"

    scan_data = {
        "location": f"X:{int(bot.x)} | Z:{int(bot.z)}",
        "status": status_str,
        "crop": crop_name,
        "disease": disease_name,
    }

    # Show Image in Ursina
    full_path = os.path.join(plant.folder_path, plant.image_name)
    tex = load_texture(full_path)
    
    if tex:
        aspect = tex.width / tex.height
        image_panel.scale = (0.6, 0.6 / aspect)
        image_panel.texture = tex
        image_panel.enabled = True
    else:
        print(f"Error loading texture: {full_path}")
    
    mouse.locked = False 

    # [FIX] Use invoke with delay to let Ursina render the image frame 
    # BEFORE the Tkinter window pauses the engine.
    invoke(open_details_popup, scan_data, delay=0.1)

# --- 8. MAIN GAME LOOP ---
camera.position = (0, 70, -90)
camera.rotation_x = 45

def update():
    camera.x = bot.x
    camera.z = bot.z - 50
    
    if not image_panel.enabled:
        speed = 20 * time.dt
        if held_keys['w']: bot.z += speed
        if held_keys['s']: bot.z -= speed
        if held_keys['a']: bot.x -= speed
        if held_keys['d']: bot.x += speed

        for plant in crops:
            if distance(bot, plant) < 5.0:
                plant.children[0].color = color.yellow
                if held_keys['space']:
                    open_scan_sequence(plant)
            else:
                plant.children[0].color = color.green

if __name__ == "__main__":
    app.run()