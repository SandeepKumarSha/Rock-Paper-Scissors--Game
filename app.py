
import random
import os
from flask import Flask, render_template, request, jsonify, session

app = Flask(__name__)
app.secret_key = os.urandom(24)

CHOICES = ["r", "p", "s"]
EMOJIS = {"r": "🪨", "p": "📃", "s": "✂️"}
NAMES = {"r": "Rock", "p": "Paper", "s": "Scissors"}

def determine_winner(player, computer):
    if player == computer:
        return "tie"
    elif (player == "r" and computer == "s") or \
         (player == "p" and computer == "r") or \
         (player == "s" and computer == "p"):
        return "win"
    else:
        return "lose"

def init_session():
    if "player_score" not in session:
        session["player_score"] = 0
    if "computer_score" not in session:
        session["computer_score"] = 0
    if "ties" not in session:
        session["ties"] = 0
    if "rounds" not in session:
        session["rounds"] = 0
    if "history" not in session:
        session["history"] = []

@app.route("/")
def index():
    init_session()
    return render_template("index.html")

@app.route("/play", methods=["POST"])
def play():
    init_session()
    
    data = request.get_json() or {}
    player_choice = data.get("choice", "").lower()
    
    if player_choice not in CHOICES:
        return jsonify({"error": "Invalid choice"}), 400
        
    computer_choice = random.choice(CHOICES)
    result = determine_winner(player_choice, computer_choice)
    
    # Update scores
    session["rounds"] += 1
    if result == "win":
        session["player_score"] += 1
    elif result == "lose":
        session["computer_score"] += 1
    else:
        session["ties"] += 1
        
    # Append to history (keep only the last 10 rounds)
    round_history = {
        "round_num": session["rounds"],
        "player_choice": player_choice,
        "player_emoji": EMOJIS[player_choice],
        "player_name": NAMES[player_choice],
        "computer_choice": computer_choice,
        "computer_emoji": EMOJIS[computer_choice],
        "computer_name": NAMES[computer_choice],
        "result": result
    }
    history = session["history"]
    history.insert(0, round_history)
    session["history"] = history[:10]
    
    return jsonify({
        "result": result,
        "player_choice": player_choice,
        "player_emoji": EMOJIS[player_choice],
        "player_name": NAMES[player_choice],
        "computer_choice": computer_choice,
        "computer_emoji": EMOJIS[computer_choice],
        "computer_name": NAMES[computer_choice],
        "player_score": session["player_score"],
        "computer_score": session["computer_score"],
        "ties": session["ties"],
        "rounds": session["rounds"],
        "history": session["history"]
    })

@app.route("/reset", methods=["POST"])
def reset():
    session["player_score"] = 0
    session["computer_score"] = 0
    session["ties"] = 0
    session["rounds"] = 0
    session["history"] = []
    
    return jsonify({
        "player_score": 0,
        "computer_score": 0,
        "ties": 0,
        "rounds": 0,
        "history": []
    })

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
