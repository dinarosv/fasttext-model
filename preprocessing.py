from norec import load, html_to_text
import os
import string
import csv

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

def preprocessing(subset, output, cut):
    t_data = load("data/html.tar.gz", subset=subset)

    # Convert html to text and put in a list together with rating
    train_set = [(html_to_text(html), metadata['rating'])
        for html, metadata in t_data]

    number_of_examples = len(train_set)
    train_file = open(output, "w")
    all_file = open('text/allt.csv', "w")
    
    all_file.write("target,value\n")
    for set in train_set:
        text = remove_spaces(set[0])
        text = text.lower().translate(str.maketrans('', '', string.punctuation))
        val = 3
        if set[1] > 3:
            val = 6
        elif set[1] < 4:
            val = 1
        length = len(text)
        if cut:
            if(length > 970):
                text = text[length-970:length]
        
        line = '__label__' + str(val) + ' ' + text + '\n'
        csvline = str(val) + "," + text + "\n"
        train_file.write(line)
        all_file.write(csvline)

    all_file.close()
    train_file.close()
    return number_of_examples


if __name__ == "__main__":
    train_length = preprocessing("train", "text/train.txt", False)
    dev_length = preprocessing("dev", "text/dev.txt", True)
    test_length = preprocessing("test", "text/test.txt", True)

    filenames = ['text/dev.txt', 'text/test.txt']
    try: 
        with open('text/valid.txt', 'w') as outfile:
            for fname in filenames:
                with open(fname) as infile:
                    for index, line in enumerate(infile):
                        outfile.write(line)
                        if index == 50:
                            break
    finally: 
        os.remove("text/test.txt")
        os.remove("text/dev.txt")

    print("Total:\t\t" + str(dev_length + test_length + train_length))
    print("Validation set:\t" + str(dev_length + test_length))
    print("Training set:\t" + str(train_length))






