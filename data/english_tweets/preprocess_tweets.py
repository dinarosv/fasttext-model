import csv
import re

def remove_chars(text):
    remove_names = ["@VirginAmerica", "@virginmedia", "@virginamerica", "@united", "\n"]
    for name in remove_names:
        text = text.replace(name, "")
    text = re.sub(r'\w*http\w*', '', text)
    text = re.sub(r'\w*@\w*', '', text)
    return text

if __name__ == "__main__":
    with open('Tweets.csv', mode='r') as csv_file:
        with open('train.txt', "w") as train_file:
            with open('test.txt', "w") as test_file:
                csv_reader = csv.DictReader(csv_file)
                line_count = 0
                for row in csv_reader:
                    if line_count == 0:
                        print(f'Column names are {", ".join(row)}')
                        line_count += 1
                    
                    text = row["text"]
                    text = remove_chars(text)
                    if row["airline_sentiment"] == "positive":
                        if line_count < 120001:
                            train_file.write(f'__label__2 {text}' + "\n")
                        else:
                            test_file.write(f'__label__2 {text}' + "\n")
                    else:
                        if line_count < 12001:
                            train_file.write(f'__label__1 {text}' + "\n")
                        else:
                            test_file.write(f'__label__1 {text}' + "\n")
                    line_count += 1
                print(f'Processed {line_count} lines.')