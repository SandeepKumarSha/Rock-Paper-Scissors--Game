# Rock Paper Scissors (Command-line)

A simple command-line Rock Paper Scissors game where you play against the computer.

## Features

- User vs Computer gameplay
- Random computer selection (uses Python's `random` module)
- Emoji representation: 🪨 📃 ✂️
- Input validation and option to play multiple rounds

## How It Works

- The user enters `r` for Rock (🪨), `p` for Paper (📃) or `s` for Scissors (✂️).
- The computer randomly selects one of the three options.
- The program compares choices and prints the winner (or tie).

## How to Run

1. Make sure you have Python 3 installed.
2. From the project directory run:

```bash
python3 rock_paper_scissor.py
```

If your environment uses `python` for Python 3, use:

```bash
python rock_paper_scissor.py
```

## Example

```
Rock, Paper, Scissors (r/p/s): r
You chose: 🪨
Computer chose: ✂️
You win!

Do you want to play again? (y/n): y
```

## Game Rules

| Player       |     Computer | Result |
| ------------ | -----------: | :----: |
| Rock (r)     | Scissors (s) |  Win   |
| Paper (p)    |     Rock (r) |  Win   |
| Scissors (s) |    Paper (p) |  Win   |
| same choice  |  same choice |  Tie   |

## Future Improvements

- Add score tracking
- Add best-of-3 / best-of-5 mode
- Add a GUI using Tkinter
- Add sound effects

## Author

Sandeep Kumar Sha
