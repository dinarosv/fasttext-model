import re
import string

def remove_chars(text):
    # remove links
    pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    text = pattern.sub('', text)
    # remove punctuations
    text = text.translate(str.maketrans('', '', string.punctuation))
    # remove newlines and strip text
    text = text.replace("\n", "").strip()
    return text

pos = 0
neg = 0
with open("dataset.txt") as dataset:
    with open("train.txt", "w") as trainfile:
        with open("test.txt", "w") as testfile:
            for index, line in enumerate(dataset):
                if index != 0:
                    value = int(line.split("	")[1])+1
                    if value == 2:
                        pos += 1
                    if value == 1:
                        neg += 1
                    text = remove_chars(line[11:])
                    nline = "__label__" + str(value) + " " + text
                    if index < round(25000*0.8):
                        trainfile.write(nline + "\n")
                    else:
                        testfile.write(nline + "\n")
            print(pos)
            print(neg)
    
