with open('not_stemmed.txt') as readfile:
    with open('train.txt', 'w') as trainfile:
        with open('test.txt', 'w') as testfile:
            for index, line in enumerate(readfile):
                txt = "__label__" + line.split(";")[0] + " " + line.split(";")[1] + "\n"
                if index < (207302*0.8):
                    trainfile.write(txt)
                else:
                    testfile.write(txt)