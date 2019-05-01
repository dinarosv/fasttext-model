
if __name__ == "__main__":
    corrects = 0
    total = 0
    with open("../data/amazon/result_wat.txt") as watsonfile, open("../data/amazon/cuttest.ft.txt") as validationfile:
        for x, y in zip(watsonfile, validationfile):
            line = x.strip()
            corrline = y.strip()
            if line[9:10] == corrline[9:10]:
                corrects += 1
            else:
                print(line)
                print(corrline)
            total += 1
        print(total)
    print("Accuracy Watson: " + str(round((corrects/total * 100),2)) + "%")
    # Result: 85.68% for 30 000 linjer