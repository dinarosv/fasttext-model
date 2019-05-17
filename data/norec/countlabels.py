
with open("dataset.txt") as readfile:
    neu = 0
    pos = 0
    neg = 0
    for line in readfile:
        if line[0] == "0":
            neg += 1
        elif line[0] == "1":
            neu += 1
        elif line[0] == "2":
            pos += 1
    print(neg)
    print(neu)
    print(pos)