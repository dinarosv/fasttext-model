from norec import load, html_to_text
import os
import string
import re

def get_stop_words():
    stop_words = []
    with open("../stopwords/stopwords.txt") as infile:
        for line in infile:
            stop_words.append(line.split("\n")[0])
    return stop_words

def remove_stop_words(querytext, stop_words):
    stop_words = get_stop_words()
    resultwords  = [word for word in querytext.split() if word.lower() not in stop_words]
    result = ' '.join(resultwords)
    return result

def remove_spaces(text):
    return text.replace('\n', '').replace('-', '').replace('\u00A0', ' ')

def remove_numbers(text): 
    numb = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    for n in numb:
        text = text.replace(str(n), "")
    return text 

# Prep does the same preprocessing as fasttext in their examples
def prep(text):
    text = text.lower()
    punctuations = [".", ",", "/", "'", "\"", "(", ")", "!", "?", ";", ":"]
    for p in punctuations: 
        text = text.replace(p, " " + p + " ")
    text = re.sub(' +', ' ', text)
    return text

def preprocessing(subset, output, testset):
    t_data = load("html.tar.gz", subset=subset)

    # Convert html to text and put in a list together with rating
    train_set = [(html_to_text(html), metadata['rating'])
        for html, metadata in t_data]

    number_of_examples = len(train_set)

    # We will combine validation set and test set to one test set, so we have a 20/80 relationship of the data
    if testset: train_file = open(output, "a")
    else: train_file = open(output, "w")
    

    for set in train_set:
        text = remove_spaces(set[0])
    
        # Remove unwanted elements in the example
        text = prep(text)
        
        if set[1] > 4:
            line = '__label__' + str(6) + ' ' + text + '\n'
            train_file.write(line)
        elif set[1] < 3:
            line = '__label__' + str(1) + ' ' + text + '\n'
            train_file.write(line)
        else:
            line = '__label__' + str(3) + ' ' + text + '\n'
            train_file.write(line)

    train_file.close()
    return number_of_examples


if __name__ == "__main__":
    if os.path.isfile('test.txt'):
        os.remove("test.txt")

    train_length = preprocessing("train", "train.txt", False)
    dev_length = preprocessing("dev", "test.txt", True)
    test_length = preprocessing("test", "test.txt", True)
    
    print("Total:\t\t" + str(dev_length + test_length + train_length))
    print("Test set:\t" + str(dev_length + test_length))
    print("Training set:\t" + str(train_length))






