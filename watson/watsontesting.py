
if __name__ == "__main__":
    corrects = 0
    total = 0
    with open("./text/en_result.txt") as watsonfile, open("./text/validation.txt") as validationfile:
        for x, y in zip(watsonfile, validationfile):
            line = x.strip()
            corrline = y.strip()
            if line[9:10] == corrline[9:10]:
                corrects += 1
            total += 1
    print("Accuracy Watson: " + str(round((corrects/total * 100),2)) + "%")