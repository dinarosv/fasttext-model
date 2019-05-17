# Split twitter dataset in training and testing with ratio 80/20
with open("snewdataset.txt") as infile:
    with open("train.txt", "w") as train:
        with open("test.txt", "w") as test:
            for index, line in enumerate(infile):
                if index != 0:
                    if index < round(4724 * 0.8):
                        train.write(line)
                    else:
                        test.write(line)
