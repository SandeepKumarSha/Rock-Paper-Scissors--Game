import random

choices =("r", "p", "s")
emojis = {"r": "🪨", "p": "📃", "s": "✂️"}


while True:
    #ask user for choice
    user_choice=input("Rock, Paper, Scissors (r/p/s): ").lower()

    #If choice is not valid
    if user_choice not in choices:
        print("Invalid choice! Please choose r, p, or s.")
        continue
    #Let computer choose
    computer_choice = random.choice(choices)

    #Print Choice of user and computer(emojis)
    print("You chose: " + emojis[user_choice])
    print("Computer chose: " + emojis[computer_choice])

    #Determine winner
    if user_choice == computer_choice:
        print("   Tie!   ")
    elif (user_choice == "r" and computer_choice == "s") or (user_choice == "p" and computer_choice == "r") or (user_choice == "s" and computer_choice == "p"):
        print("   You win!   ")
    else:
        print("   You Lost!   ")


    #ask user if they want to play again
    should_continue = input("Do you want to play again? (y/n): ").lower()
    #IF not
    if should_continue == "n":
        #. print "Thanks for playing"
        print("Thanks for playing!")
        break
    