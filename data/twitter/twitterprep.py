# Split twitter dataset in training and testing with ratio 80/20

with open("dataset.txt") as infile:
    with open("trainfile.txt", "w") as train:
        with open("testfile.txt", "w") as test:
            for index, line in enumerate(infile):
                if index < round(105893 * 0.8):
                    train.write(line)
                else:
                    test.write(line)