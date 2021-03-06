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
with open("ns_shuffled_dataset.txt") as infile:
    with open("ns_train.txt", "w") as train:
        with open("ns_test.txt", "w") as test:
            for index, line in enumerate(infile):
                if index != 0:
                    if index < round(110602 * 0.8):
                        train.write("__label__" + line.split(";")[0] + " " + line.split(";")[1] + "\n")
                    else:
                        test.write("__label__" + line.split(";")[0] + " " + line.split(";")[1] + "\n")
