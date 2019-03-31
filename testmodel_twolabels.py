from fastText import load_model
import sys
import os
import time

def stripName(text):
    return text[0][0].split('__')[2]

def strip_prob(text):
    return text[1][0]

def count_labels():
    pos = 0
    neg = 0
    trainfile = sys.argv[2] or 'data/amazon/train.ft.txt'
    with open(trainfile) as textfile:
        for line in textfile:
            val = line.split(' ')[0]
            val = val.split('__label__')[1]
            if val == '2':
                pos += 1
            elif val == '1':
                neg += 1
    print("negative: " + str(neg))
    print("positive: " + str(pos))

if __name__ == "__main__":
    #count_labels()

    model = sys.argv[1] or "models/english_model.bin"
    m = load_model(model)

    text = ""

    #--- Input from console ---
    while text != "q":
        print("Type a sentence to analyze and then press ENTER...")

        text = sys.stdin.readline().replace("\n", "")

        prediciton = m.predict(text, 3)
        value = stripName(prediciton)
        prob = strip_prob(prediciton)

        if value == "2":
            print("Value: Positive")
        elif value == "1":
            print("Value: Negative")
        else:
            print("Value: Neutral")

