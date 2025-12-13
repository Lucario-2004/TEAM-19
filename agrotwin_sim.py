import json
import random
import os
from ursina import *

# --- 1. FILE SYSTEM SETUP ---
HEALTHY_DIR = "healthy crops"
UNHEALTHY_DIR = "unhealthy crops"
CONFIG_FILE = "field_config.json"

def get_images_from_folder(folder_path):
    if not os.path.exists(folder_path):
        print(f"⚠️ WARNING: Folder '{folder_path}' not found.")
        return ["no_image_found.jpg"] 
    
    files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not files:
        print(f"⚠️ WARNING: No images found in '{folder_path}'.")
        return ["placeholder.jpg"]
        
    return files

healthy_images = get_images_from_folder(HEALTHY_DIR)
unhealthy_images = get_images_from_folder(UNHEALTHY_DIR)

# --- 2. LOAD JURY CONFIGURATION ---
def load_jury_config():
    if not os.path.exists(CONFIG_FILE):
        print(f"❌ ERROR: {CONFIG_FILE} not found! Run jury_input.py first.")
        return set()
    
    with open(CONFIG_FILE, 'r') as f:
        data = json.load(f)
        return {(item['row'], item['col']) for item in data['defective_spots']}

jury_selected_spots = load_jury_config()

# --- 3. URSINA APP SETUP ---
app = Ursina()
window.title = "AGRO-TWIN: 3D Field Scan"
window.color = color.black
window.borderless = False

# --- 4. THE 3D FIELD GENERATION ---
ground = Entity(
    model='plane', scale=(120, 1, 120), color=color.rgb(20, 20, 20),
    texture='grid', texture_scale=(10, 10), collider='box'
)

crops = []
grid_size = 10
spacing = 10
start_offset = -45 

for row in range(grid_size):
    for col in range(grid_size):
        x_pos = start_offset + (col * spacing)
        z_pos = start_offset + (row * spacing)
        
        if (row, col) in jury_selected_spots:
            is_defective = True
            img_file = random.choice(unhealthy_images)
            folder_source = UNHEALTHY_DIR
        else:
            is_defective = False
            img_file = random.choice(healthy_images)
            folder_source = HEALTHY_DIR
            
        plant = Entity(
            model='cube',
            position=(x_pos, 0, z_pos),
            scale=(1, 3, 1),
            color=color.green, 
            texture='white_cube',
            collider='box'
        )
        
        foliage = Entity(
            parent=plant, model='sphere', y=0.5, scale=(1.5, 0.5, 1.5),
            color=color.green, texture='grass'
        )
        
        plant.is_defective = is_defective
        plant.image_name = img_file
        plant.folder_path = folder_source
        plant.grid_coords = (row, col)
        
        crops.append(plant)

# --- 5. THE BOT ---
bot = Entity(
    model='cube', color=color.cyan, scale=(2, 2, 2), y=1,
    position=(0, 1, 0)
)
PointLight(parent=bot, color=color.cyan, range=15)

# --- 6. SCANNING WINDOW (UI) - FIXED ---
# We create a specific "Button" that will act as our Image Display. 
# We disable it so it doesn't click like a button, but it holds the texture.
scan_panel = WindowPanel(
    title='AGRO-TWIN SCANNER',
    content=(
        Text(text='Initializing...', origin=(0,0), wordwrap=30), 
        
        # [FIX] This is the Image Holder
        Button(
            color=color.white, 
            highlight_color=color.white, 
            pressed_color=color.white, 
            texture='white_cube', # Placeholder
            scale=(0.5, 0.5)      # Size of the image
        ),
        
        Space(height=1),
        Button(text='CLOSE', color=color.red)
    ),
    popup=True,
    enabled=False
)

def close_scan():
    scan_panel.enabled = False
    mouse.locked = True

# Connect the close button (the last item in content)
scan_panel.content[-1].on_click = close_scan

def open_scan(plant):
    # Determine Status Text
    if plant.is_defective:
        status_text = "⚠️ DEFECT DETECTED"
        status_col = "<red>"
    else:
        status_text = "✅ HEALTHY CROP"
        status_col = "<green>"
        
    # Update Text Info
    info = (
        f"Location: Row {plant.grid_coords[0]}, Col {plant.grid_coords[1]}\n"
        f"Status: {status_col}{status_text}<default>\n"
        f"File: {plant.image_name}"
    )
    scan_panel.content[0].text = info
    
    # [FIX] Update the Image Texture
    # We construct the full path: "healthy crops/corn-healthy.jpg"
    full_path = os.path.join(plant.folder_path, plant.image_name)
    
    # Assign it to the Button (content[1])
    # Ursina automatically loads the texture from the path string
    scan_panel.content[1].texture = full_path 
    
    scan_panel.enabled = True
    mouse.locked = False 

# --- 7. MAIN UPDATE LOOP ---
camera.position = (0, 70, -90)
camera.rotation_x = 45

def update():
    camera.x = bot.x
    camera.z = bot.z - 50
    
    if not scan_panel.enabled:
        speed = 20 * time.dt
        if held_keys['w']: bot.z += speed
        if held_keys['s']: bot.z -= speed
        if held_keys['a']: bot.x -= speed
        if held_keys['d']: bot.x += speed

    if not scan_panel.enabled:
        for plant in crops:
            if distance(bot, plant) < 5.0:
                plant.children[0].color = color.yellow
                if held_keys['space']:
                    open_scan(plant)
            else:
                plant.children[0].color = color.green

# --- RUN APP ---
app.run()