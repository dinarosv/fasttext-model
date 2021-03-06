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
    trainfile = sys.argv[2] if len(sys.argv) > 1 else 'data/norec/train.txt'
    with open(trainfile) as textfile:
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
    model = sys.argv[1] if len(sys.argv) > 0 else "models/model.bin"
    m = load_model(model)

    if len(sys.argv) > 2:
        test_data = os.path.join(os.getenv("DATADIR", ''), sys.argv[3])
        print_results(*m.test(test_data))
    text = ""

    #--- Input from console ---
    while text != "q":
        print("Type a sentence to analyze and then press ENTER...")
        text = sys.stdin.readline().replace("\n", "")

        prediciton = m.predict(text, 1)
        value = stripName(prediciton)
        prob = strip_prob(prediciton)

        if value == "1":
            print("Value: Negative, Probability: " + str(round(prob, 4)))
        elif value == "2":
            print("Value: Positive, Probability: " + str(round(prob, 4)))
        else:
            print("Value: Neutral, Probability: " + str(round(prob, 4)))

