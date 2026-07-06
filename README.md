# 🌌 Retro-Neon Rock Paper Scissors Arena

A highly polished, premium web-based Rock Paper Scissors game featuring a gorgeous retro-neon cyber aesthetic. Built with Python (Flask) on the backend and modern vanilla frontend technologies (HTML5, CSS3, JS), this game delivers an immersive arcade-style gaming experience right in the browser. 

The project also includes a classic CLI/terminal version for quick command-line gameplay.

---
## 🚀 Live Demo

Play the game here:
https://rock-paper-scissors-game-psi-three.vercel.app

---
## 🎮 Live Game Modes
- **Endless Arena**: Play as many rounds as you want; track player wins, CPU wins, and ties indefinitely.
- **Best of 3 (BO3)**: First to reach 2 victories wins the series.
- **Best of 5 (BO5)**: First to reach 3 victories wins the series.

---

## ✨ Features
- **Aesthetic Glassmorphic UI**: Vibrant neon glows, smooth micro-animations, starfield backdrop, and glassmorphic panels.
- **Web Audio Synthesizer**: Custom retro sound effects (click, thump, round win/lose, victory/defeat fanfares) generated dynamically using the HTML5 **Web Audio API** (no external audio files to load!).
- **Confetti Engine**: Interactive 2D HTML5 Canvas particle physics system that showers the screen in confetti upon a series victory.
- **Live Battle Log**: Shows a dynamic timeline of the last 10 rounds with results and choices.
- **Flask Session Sync**: Keeps score state secure and synchronized.
- **Mute/Unmute**: Sound control directly from the configuration bar.
- **Responsive Layout**: Seamlessly transitions from mobile screens to 4K displays.

---

## 📂 Project Structure

```text
├── app.py                      # Flask Server (backend game logic & session state)
├── rock_paper_scissor.py       # Classic CLI/Terminal version of the game
├── requirements.txt            # Python dependencies (Flask)
├── templates/
│   └── index.html              # Game layout (HTML5 structured template)
├── static/
│   ├── css/
│   │   └── style.css           # Premium styling (neon glows, animations, variables)
│   └── js/
│       └── game.js             # Core game logic, Web Audio synth, & Confetti canvas
└── README.md                   # Project documentation (this file)
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Python 3.x** installed on your system.

### Setup Instructions

1. **Clone or download** this repository to your local machine.
2. **Navigate** into the project folder:
   ```bash
   cd Rock-Paper-Scissors--Game-main
   ```
3. **Set up a virtual environment** (recommended):
   ```bash
   python -m venv .venv
   ```
   *Activate it:*
   - **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
   - **Windows (CMD):** `.venv\Scripts\activate.bat`
   - **macOS/Linux:** `source .venv/bin/activate`

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

---

## 🎯 How to Run

### 🌐 Run the Web Application
Start the Flask development server:
```bash
python app.py
```
After starting the server, open your browser and navigate to:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

---

### 💻 Run the Command Line Version
If you want to play the quick terminal-based version, run:
```bash
python rock_paper_scissor.py
```

---

## ⚔️ Game Rules & Legend

The core rules of the game are standard:

| Weapon | Beat by Weapon | Beats Weapon | Emoji | Key (CLI) |
| :--- | :--- | :--- | :---: | :---: |
| **Rock** | 📃 Paper | ✂️ Scissors | 🪨 | `r` |
| **Paper** | ✂️ Scissors | 🪨 Rock | 📃 | `p` |
| **Scissors** | 🪨 Rock | 📃 Paper | ✂️ | `s` |

---

## 🎨 Tech Stack Breakdown

- **Backend**: Python 3, Flask (Session-based state & JSON endpoints)
- **Frontend CSS**: Vanilla CSS3 (Custom properties/variables, keyframe animations, glassmorphic layout)
- **Frontend JS**: Vanilla ES6 JavaScript (Fetch API, Web Audio API, Canvas 2D API for particles)
- **Typography**: Google Fonts (*Outfit* and *JetBrains Mono*)

---

## ✍️ Author
- **Sandeep Kumar Sha**

Enjoy playing! May the odds be ever in your favor. 🌌🎮
