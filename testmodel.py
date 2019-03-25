from fastText import load_model
import sys
import os
from trainmodel import print_results
import time

def stripName(text):
    return text[0][0].split('__')[2]

if __name__ == "__main__":
    m = load_model("./model.bin")

    text = ""

    print_results(*m.test(os.path.join(os.getenv("DATADIR", ''), 'text/validation.txt')))

    #--- Example input on a negative sentiment ---
    #text = "I fjorårets rapport lå Norge på andreplass. Dermed har vi altså rykket ned på listen over verdens lykkeligste."
    
    #--- Example input on a positive sentiment ---
    #text = "I dag har det jo vært fakkeltog mot pels, og fy søren så fantastisk det var å se så mange flotte folk engasjere seg."
    
    #--- Input from console ---
    print("Type a sentence to analyze and then press ENTER...")
    text = sys.stdin.readline().replace("\n", "")

    #--- Input from file
    #with open("./text/testondoc.txt") as infile:
     #  for line in infile:
      #    text += line
    #text = text.replace("\n", "")

    start = time.time()
    prediciton = m.predict(text)
    end = time.time()
    value = stripName(prediciton)

    if value == "1":
        print("Value: Negative")
    elif value == "6":
        print("Value: Positive")
    else:
        print("Value: Neutral")

    print("Found in " + str(round((end-start)*1000, 5)) + " ms.")
