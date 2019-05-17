

with open("two_labels.txt") as dataset:
    with open("twotrain.txt", "w") as train:
        with open("twotest.txt", "w") as test:
            for index, line in enumerate(dataset):
                if index > 0:
                    text = "__label__" + line.split(";")[0] + " " + line.split(";")[1] + "\n"
                    if index < (114742*0.8):
                        train.write(text)
                    else:
                        test.write(text)