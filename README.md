🌱 Agri Twin: AI-Driven Crop Simulation & Intelligent RAG Assistant 🤖🌾
Team Mithuna | Hackathon Edition | Agriculture 5.0

"From Virtual Roots to Real Results: Bridging the Soil-Cloud Gap." 🚜☁️

🚩 1. The Problem Statement: The "Silent Crisis" in Indian Fields
Agriculture in India is currently facing a massive "Triple Threat": Disease Latency, Resource Wastage, and Information Asymmetry.

While the world moves towards Industry 5.0, the average Indian farmer is still stuck in reactive farming. The core issues we have identified are:


Delayed Detection & High Crop Loss: Farmers lose up to 30% of their annual yield due to diseases that go undetected until it is too late. Manual scouting—walking through acres of crops to find tiny leaf spots—is labor-intensive, slow, and prone to human error. By the time a disease like Late Blight is visible to the naked eye from a distance, it has often already infected the entire crop row.


The Knowledge Gap (Information Asymmetry): Even when a farmer successfully identifies a sick plant, they face a "knowledge wall." They may not know the scientific name of the disease or the precise chemical treatment required. This leads to reliance on local shopkeepers who may push expensive or ineffective products.

Resource Inefficiency: Without precise data, farmers often resort to "blanket spraying"—dousing the entire field with pesticides. This not only wastes money but also degrades soil health and increases chemical residue in food.

The Hardware Barrier: Existing robotic solutions are often designed for massive industrial farms in the West. They are expensive, require complex infrastructure, and are inaccessible to the small-to-medium scale Indian farmer.


The Core Conflict: The technology to solve this exists (AI, Robotics, IoT), but it is fragmented and expensive. There is no affordable, end-to-end system that closes the loop between seeing the problem and solving it for the common farmer.

👥 2. User Personas: Voices from the Field
To ensure our solution is grounded in reality, we designed Agri Twin around two specific personas representing the spectrum of Indian agriculture.

👨‍🌾 Persona A: Ramesh, The "Hands-On" Cultivator
Profile: A 45-year-old medium-scale farmer in Guntur, Andhra Pradesh, growing chilies and cotton.

The Scenario: Ramesh spends 4 hours every morning walking his muddy fields. Last season, he missed a small patch of Leaf Curl Virus hidden in the middle of a dense row.

The Pain Point: "I work hard, but I can't look at every single leaf. By the time I saw the yellowing, half my crop was gone. Then I spent ₹10,000 on medicines that didn't even work because I guessed the disease wrong."

The Need: Ramesh needs a "second pair of eyes" that never gets tired and an expert friend who can tell him exactly what affordable medicine to buy immediately.

👩‍💻 Persona B: Ananya, The "Remote" Tech-Farmer
Profile: A 28-year-old software engineer in Hyderabad who manages her family's ancestral tomato greenhouse in her village to generate passive income.

The Scenario: She can only visit the farm on weekends. She relies on phone calls from caretakers, which leads to "Decision Latency"—vital information about water stress or early pest signs reaches her days too late.

The Pain Point: "I am flying blind during the week. I want to manage my farm like I manage my servers—with real-time data. I want to log in, see a digital replica of my plants, and know if Row 4 needs water without driving 200km."

The Need: A Digital Twin. A virtual, real-time replica of her farm on her smartphone that lets her scout crops remotely and an AI assistant that acts as her on-call agronomist.



🔍 3. Understanding the Problem Depth
The problem isn't just "finding spots on leaves." It is about the entire Decision Support Cycle.


The Granularity Gap: Satellite imagery is too low-resolution to detect early-stage leaf lesions. IoT sensors measure soil moisture at fixed points but cannot "see" a fungal infection spreading on a leaf.



The "Weak Buffer" Reality: Implementing robotics in agriculture is technically difficult. Bridging high-speed AI computing (like the Jetson Orin Nano) with high-power motors requires complex engineering to handle voltage gaps (1.8V vs 5V). Standard hobbyist solutions often fail in these rugged environments.



Disconnected Action: Finding the disease is only half the battle. If the system detects Early Blight, but the farmer doesn't know the correct fungicide dosage, the crop is still lost. There is a disconnect between detection (seeing the bug) and remediation (knowing the cure).


Agri Twin's Insight: We need a system that actively ingests plant-level data to update a virtual model (Digital Twin), enabling predictive analytics and precise intervention.



🚀 4. The Solution: Hackathon Implementation (Simulating the Future)
For this hackathon, we are presenting the Agri Twin Intelligence Core. Since deploying a physical robot into a real field is logistically constrained during a hackathon, we have built a High-Fidelity Simulation that demonstrates the software brain of our autonomous system.

We propose a Two-Stage Integrated Solution:

🎮 Phase 1: The "Virtual Scout" (Simulation Environment)
We have created a virtual crop field that mirrors the real-world environment our physical robot would navigate.

The Virtual Field: A digital environment representing crop rows (e.g., Tomatoes, Corn) where we can simulate different plant health states.

The Simulated Scout Bot: A user-controlled (or autonomous) virtual robot that navigates the field.

Simulated AI Vision:

As the bot moves past virtual plants, it performs a "Digital Scan."

If the bot enters the proximity of a plant coded with a disease (e.g., Tomato Early Blight or Corn Rust), it triggers a detection event.

This mimics the YOLOv8 inference process of our real-world hardware, identifying the disease class and location instantly.




Real-Time Alert: The user receives an immediate visual alert on the dashboard: "CRITICAL: Early Blight Detected at Row 4, Plant 12."

🧠 Phase 2: The RAG-Powered "Digital Agronomist" Chatbot
This is where we solve the "Knowledge Gap." Once the simulation detects a problem, we don't just leave the farmer with an error code. We provide a solution.

Seamless Handover: Upon detection, a pop-up window automatically launches, connecting the user to our AI Chatbot.

RAG (Retrieval-Augmented Generation):

Unlike basic chatbots that "hallucinate," our bot is powered by RAG. It retrieves information from a curated vector database of agricultural research papers, pesticide manuals, and real-time internet sources.

Context-Aware: The chatbot is initialized with the specific context from the scan: ("Disease: Early Blight", "Crop: Tomato", "Location: Row 4").

Interactive Resolution:

Diagnosis: The bot confirms the issue: "Your scan identified Early Blight. This is a fungal infection common in high humidity."


Regression & Prediction: Using historical data and simulated environmental factors (humidity/temp), the bot predicts the spread: "Warning: Based on current humidity levels, this is likely to spread to Row 5 within 24 hours.".



Prescription: It answers the farmer's critical questions:


"What do I spray?" -> "I recommend Mancozeb 75% WP.".


"How much?" -> "Mix 2.5g per liter of water."

"Is it safe?" -> "Wear a mask while spraying. Do not harvest for 3 days after application."

🌟 5. Strategic Advantages: Why This Approach Wins
Our simulated approach highlights several key advantages that translate directly to the real-world Agri Twin system.

✅ Advantage 1: "Zero-Latency" Decision Making
The Benefit: We eliminate the days-long delay between a disease appearing and a farmer noticing it.

How We Achieve It: By automating the scanning process (simulated here with the bot), we ensure every plant is checked. The YOLOv8-based detection logic happens in milliseconds. The RAG Chatbot provides the cure instantly, meaning a farmer can treat the crop minutes after detection, not days.


✅ Advantage 2: Precision Over Guesswork
The Benefit: Farmers stop wasting money on the wrong chemicals or "blanket spraying" healthy plants.


How We Achieve It: The system identifies the exact location (e.g., Row 4) and the specific disease. The Chatbot calculates the precise dosage based on the severity found in the scan. This "Precision Agriculture" approach saves money and protects the soil.



✅ Advantage 3: Democratizing Expert Knowledge
The Benefit: Small farmers get access to the same level of agronomy advice as large corporate farms, without paying for expensive consultants.

How We Achieve It: The RAG Chatbot acts as a free, 24/7 expert. By integrating vast agricultural datasets  into the chat interface, we make expert knowledge accessible via a simple text query, bridging the gap between scientific research and the farmer's phone.


✅ Advantage 4: Proactive vs. Reactive Farming
The Benefit: Farmers can prevent disease outbreaks before they destroy the harvest.

How We Achieve It: The simulation demonstrates predictive analytics. By combining the "detected disease" data with environmental data (like simulated humidity), the system warns the farmer of future risks (e.g., "Spray Row 5 now to prevent spread"). This shifts the entire farming model from reacting to disaster to preventing it.


🚜 The Real-World Vision (Behind the Simulation)
While we are simulating today, the hardware roadmap is ready:


Brain: NVIDIA Jetson Orin Nano (67 TOPS) for real-time edge AI.



Body: Rugged chassis with L298N motors and PCA9685 I2C drivers for reliable field navigation.



Connectivity: WebSockets and MQTT for real-time Digital Twin synchronization.


Agri Twin is more than a bot—it is a lifeline for the future of sustainable farming. 🌱🚀

# AGRO-TWIN: Agricultural Digital Twin Platform

A revolutionary agricultural digital twin platform that combines AI-powered analysis, 3D field simulation, and expert consultation to help farmers manage their crops more effectively.

## 🌱 Features

### 1. **Interactive Landing Page**
- Modern, vibrant UI with agricultural theme
- Animated backgrounds and smooth transitions
- Comprehensive project overview
- Technology stack showcase

### 2. **Field Configuration System**
- Interactive 10x10 grid interface
- Select up to 15 infection spots for simulation
- Real-time progress tracking
- Visual feedback with color-coded cells

### 3. **3D Field Simulation**
- Real-time 3D field visualization using Three.js
- Controllable neon blue bot with WASD/Arrow keys
- Neon green crops with interactive scanning
- Space bar to scan nearby crops
- Real-time position tracking and scan history

### 4. **AI Expert Chatbot**
- **CAG (Continuous Augmented Generation)** architecture
- **Regression Learning** system that adapts to user queries
- **NLP Processing** for intelligent question matching
- **Context-aware** responses based on crop analysis
- **Gemini 2.5 Pro** powered AI backend
- Interactive question suggestions with learning weights

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **3D Graphics**: Three.js with React Three Fiber
- **UI Components**: shadcn/ui with Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini 2.5 Pro API
- **State Management**: React hooks and localStorage
- **Styling**: Tailwind CSS with custom agricultural theme

## 🎯 Key Components

### Landing Page (`/`)
- Project introduction and feature showcase
- Animated hero section with gradient effects
- Technology stack display
- Call-to-action buttons

### Configuration Page (`/configuration`)
- Interactive grid for field setup
- Real-time selection tracking
- Progress indicators
- Configuration persistence

### Simulation Page (`/simulation`)
- 3D field environment with Three.js
- Bot movement controls (WASD/Arrow keys)
- Crop scanning functionality (Space bar)
- Real-time scan results and history
- Status dashboards

### AI Chatbot (`/chatbot`)
- Context-aware AI assistant
- Regression learning for question adaptation
- Quick action buttons
- Learning status indicators
- Conversation history

## 🧠 AI Architecture

### CAG (Continuous Augmented Generation)
- Maintains continuous context of crop analysis
- Adapts responses based on current field conditions
- Provides personalized recommendations

### Regression Learning
- Learns from user interactions
- Adapts question suggestions based on usage patterns
- Implements weight-based question ranking
- Persistent learning across sessions

### NLP Processing
- Intelligent question matching
- Semantic similarity analysis
- Contextual understanding
- Adaptive response generation

## 🎨 Design System

### Color Palette
- **Primary**: Green gradient (#00ff00 to #44ff44)
- **Secondary**: Blue accents (#00d4ff)
- **Background**: Dark theme (#0a0a0a to #1a1a1a)
- **Alert**: Red for defective crops (#ff4444)

### Visual Effects
- Neon glow effects for interactive elements
- Smooth animations and transitions
- Gradient backgrounds
- Glass-morphism effects
- Responsive design

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # AI chat API endpoint
│   ├── chatbot/
│   │   └── page.tsx             # AI expert interface
│   ├── configuration/
│   │   └── page.tsx             # Field configuration
│   ├── simulation/
│   │   └── page.tsx             # 3D simulation
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/
│   ├── chatbot/
│   │   └── ChatInterface.tsx    # Chat component
│   ├── simulation/
│   │   └── FieldSimulation.tsx  # 3D simulation component
│   └── ui/
│       ├── navigation.tsx       # Navigation components
│       └── loading.tsx          # Loading screens
└── lib/
    └── utils.ts                 # Utility functions
```

## 🖼️ Asset Management

### Crop Images
- **Healthy Crops**: `/public/images/healthy-crops/`
  - wheat-healthy.jpg
  - corn-healthy.jpg
  - rice-healthy.jpg

- **Unhealthy Crops**: `/public/images/unhealthy-crops/`
  - wheat-rust.jpg
  - wheat-mildew.jpg
  - wheat-septoria.jpg
  - wheat-stem_rust.jpg
  - wheat-fusarium.jpg
  - corn-blight.jpg
  - corn-wilt.jpg
  - corn-leaf_blight.jpg
  - corn-common_rust.jpg
  - rice-blight.jpg
  - rice-blast.jpg
  - rice-sheath_blight.jpg
  - rice-tungro.jpg
  - soybean-rot.jpg
  - soybean-sudden_death.jpg
  - soybean-brown_stem.jpg

## 🎮 User Flow

1. **Landing Page** → User learns about the project
2. **Configuration** → User sets up field with infection spots
3. **Simulation** → User navigates 3D field and scans crops
4. **AI Expert** → User gets treatment recommendations

## 🔧 Controls

### Simulation Controls
- **W/↑**: Move forward
- **S/↓**: Move backward
- **A/←**: Move left
- **D/→**: Move right
- **Space**: Scan nearby crop

### Navigation
- **Menu Button**: Toggle navigation sidebar
- **Breadcrumb**: Navigate between pages
- **Back Button**: Return to previous page

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📊 Features in Detail

### 3D Simulation
- Real-time rendering with Three.js
- Interactive bot movement
- Crop scanning with visual feedback
- Position tracking and history
- Responsive controls

### AI Chatbot
- Context-aware responses
- Learning adaptation
- Quick action buttons
- Conversation history
- Expert recommendations

### Configuration System
- Interactive grid interface
- Real-time validation
- Progress tracking
- Data persistence
- Visual feedback

## 🎯 Future Enhancements

- [ ] Multi-user support
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Additional crop types
- [ ] Weather integration
- [ ] IoT device connectivity
- [ ] Advanced disease detection
- [ ] Yield prediction models
- [ ] Integration with farm management systems

## 🤝 Contributing

This project is designed to showcase modern web development capabilities with AI integration. Feel free to explore the codebase and learn from the implementation.

## 📄 License

This project is for educational and demonstration purposes.

## 📽 Demo Explanation.
https://youtu.be/CVgFm5eWr2w?si=SJ2jyJ8795ZEL9rp

## 🤖 Open Source AI usage( Gemini ).
https://g.co/gemini/share/2eca057733a2
https://g.co/gemini/share/0e1eb911aae9

---

**AGRO-TWIN** - Revolutionizing Agriculture with Digital Twin Technology 🌾🤖
