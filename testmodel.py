from fastText import load_model
import sys
import os
from trainmodel import print_results
import time

def stripName(text):
    return text[0][0].split('__')[2]

def strip_prob(text):
    return text[1][0]

def count_labels():
    pos = 0
    neg = 0
    neu = 0
    with open('text/train.txt') as textfile:
        for line in textfile:
            val = line.split(' ')[0]
            val = val.split('__label__')[1]
            if val == '6':
                pos += 1
            elif val == '3':
                neu += 1
            elif val == '1':
                neg += 1
    print("negative: " + str(neg))
    print("neutral: " + str(neu))
    print("positive: " + str(pos))

if __name__ == "__main__":
    count_labels()
    m = load_model("./model.bin")

    text = ""

    #--- Example input on a positive sentiment ---
    #text = "I dag har det jo vært fakkeltog mot pels, og fy søren så fantastisk det var å se så mange flotte folk engasjere seg."

    # --- Input from file
    #with open("./text/testondoc.txt") as infile:
        #  for line in infile:
        #    text += line
    #text = text.replace("\n", "")

    #--- Input from console ---
    while text != "q":
        print("Type a sentence to analyze and then press ENTER...")
        text = sys.stdin.readline().replace("\n", "")

        prediciton = m.predict(text, 3)
        value = stripName(prediciton)
        prob = strip_prob(prediciton)

        if value == "1" and prob > 0.5:
            print("Value: Negative, Probability: " + str(round(prob, 4)))
        elif value == "6" and prob > 0.5:
            print("Value: Positive, Probability: " + str(round(prob, 4)))
        else:
            print("Value: Neutral")

