
pos = 0
neu = 0
neg = 0

with open("dataset.txt") as f:
    for line in f:
        if line[0] == "0":
            neg += 1
        elif line[0] == "1":
            neu += 1
        elif line[0] == "2":
            pos += 1
    print(pos)
    print(neu)
    print(neg)