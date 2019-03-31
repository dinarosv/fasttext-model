
if __name__ == "__main__":
    corrects = 0
    total = 0
    with open("../data/amazon/watsonresult.txt") as watsonfile, open("../english/test.ft.txt") as validationfile:
        for x, y in zip(watsonfile, validationfile):
            line = x.strip()
            corrline = y.strip()
            if line[9:10] == corrline[9:10]:
                corrects += 1
            total += 1
        print(total)
    print("Accuracy Watson: " + str(round((corrects/total * 100),2)) + "%")
    # Result: 85%