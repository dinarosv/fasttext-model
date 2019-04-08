import re
# Prep does the same preprocessing as fastText in their examples
def prep(text):
    text = text.lower()
    punctuations = [".", ",", "/", "'", "\"", "(", ")", "!", "?", ";", ":"]
    for p in punctuations: 
        text = text.replace(p, " ")
    text = re.sub(' +', ' ', text)
    text = text.strip()
    text = text + "\n"
    return text

# Split twitter dataset in training and testing with ratio 80/20
with open("dataset.txt") as infile:
    with open("trainfile.txt", "w") as train:
        with open("testfile.txt", "w") as test:
            for index, line in enumerate(infile):
                if index < round(361620 * 0.8):
                    train.write(line)
                else:
                    test.write(line)
