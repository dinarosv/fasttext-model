import csv

if True:
    with open('Tweets.csv', mode='r') as csv_file:
        with open('tweets_prep.txt', "w") as text_file:
            csv_reader = csv.DictReader(csv_file)
            line_count = 0
            for row in csv_reader:
                if line_count == 0:
                    print(f'Column names are {", ".join(row)}')
                    line_count += 1
                text = row["text"].replace("@VirginAmerica", "").replace("@virginmedia", "").replace("@virginamerica", "").replace("@united", "").lstrip().replace("\n","")
                textarray = text.split(" ")
                newarray = []
                for word in textarray:
                    if not "http" in word:
                        newarray.append(word)
                text = ' '.join(newarray)        
                if row["airline_sentiment"] == "positive":
                    text_file.write(f'__label__2 {text}' + "\n")
                else:
                    text_file.write(f'__label__1 {text}' + "\n")
                line_count += 1
            print(f'Processed {line_count} lines.')

if False:
    with open('test.ft.txt') as in_file:
        with open('cuttest.ft.txt', "w") as out_file:
            for index, line in enumerate(in_file):
                out_file.write(line)
                if index > 4064:
                    break