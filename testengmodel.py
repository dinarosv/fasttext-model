from fastText import load_model

m = load_model("models/english_model.bin")

with open("watson/examplesforwatson.txt") as test:
    for line in test:
        correct = line[9:10]
        predict = line[10:].replace("\n", "")
        prediciton = m.predict(predict, 1)
        value = prediciton[0][0].split('__')[2]
        if value != correct:
            print(value + " " + str(prediciton[1][0]) + " " + line)
