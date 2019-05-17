with open("dataset.txt") as dataset:
    with open("train.txt", "w") as train:
        with open("test.txt", "w") as test:
            for index, line in enumerate(dataset):
                text = "__label__" + line[0] + line[1:]
                if index < (35189*0.8):
                    train.write(text)
                else: 
                    test.write(text)