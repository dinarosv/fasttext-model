import csv
import re
import string

def remove_chars(text):
    # remove links
    pattern = re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    text = pattern.sub('', text)
    # remove tags
    text = re.sub(r'\w*@\w*', '', text)
    # remove punctuations
    text = text.translate(str.maketrans('', '', string.punctuation))
    # remove newlines and strip text
    text = text.replace("\n", "").strip()
    return text

if __name__ == "__main__":
    pos = 2363
    neg = 2363
    with open('Tweets.csv', mode='r') as csv_file:
        with open('even_dataset.txt', "w") as train_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            for row in csv_reader:
                if line_count == 0:
                    print(f'Column names are {", ".join(row)}')
                    line_count += 1
                
                text = row["text"]
                text = remove_chars(text)
                
                if row["airline_sentiment"] == "positive" and pos > 0:
                    pos -= 1
                    train_file.write(f'__label__2 {text}' + "\n")
                elif neg > 0:
                    neg -= 1
                    train_file.write(f'__label__1 {text}' + "\n")
                line_count += 1
                if neg == 0 and pos == 0:
                    break
            print(f'Processed {line_count} lines.')