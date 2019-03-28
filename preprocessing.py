from norec import load, html_to_text
import os
import string
import re

def get_stop_words():
    stop_words = []
    with open("text/stopwords.txt") as infile:
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
    t_data = load("data/html.tar.gz", subset=subset)

    # Convert html to text and put in a list together with rating
    train_set = [(html_to_text(html), metadata['rating'])
        for html, metadata in t_data]

    number_of_examples = len(train_set)

    # We will combine validation set and test set to one test set, so we have a 20/80 relationship of the data
    if testset: train_file = open(output, "a")
    else: train_file = open(output, "w")
    
    # To even out dataset for the labels. Since there's only 2200 negative examples, set equally as much positive ones.
    # Only for the training set
    pos = 2200
    neg = 2200

    for set in train_set:
        text = remove_spaces(set[0])
        length = len(text)
        
        #text = text.translate(str.maketrans('', '', string.punctuation))
        #text = remove_numbers(text)

        # Remove unwanted elements in the example
        text = prep(text)
        
        # Choose only the examples who are shorter than 400 to exclude the ones with a lot of gibberish
        if length < 400:
            if set[1] > 4:
                if pos > 0 or testset:
                    line = '__label__' + str(6) + ' ' + text + '\n'
                    train_file.write(line)
                    pos -= 1
            elif set[1] < 3:
                if neg > 0 or testset:
                    line = '__label__' + str(1) + ' ' + text + '\n'
                    train_file.write(line)
                    neg -= 1
            else:
                line = '__label__' + str(3) + ' ' + text + '\n'
                train_file.write(line)

    train_file.close()
    return number_of_examples


if __name__ == "__main__":
    os.remove("text/test.txt")

    train_length = preprocessing("train", "text/train.txt", False)
    dev_length = preprocessing("dev", "text/test.txt", True)
    test_length = preprocessing("test", "text/test.txt", True)
    
    print("Total:\t\t" + str(dev_length + test_length + train_length))
    print("Test set:\t" + str(dev_length + test_length))
    print("Training set:\t" + str(train_length))






