import sys

# result: [corrects, fails, all]
result = [0, 0, 0]

with open("humancorrects.txt") as read_file:
    lines = read_file.readlines()
    length = len(lines)
    line = lines[length-1].split(" ")
    result += line
    print("r" + str(result[0]))

with open("cuttest.ft.txt") as test_file:
    with open("humancorrects.txt", "a") as corr_file:
        for index, line in enumerate(test_file):
            if index > result[2]:
                print(line[10:])
                value = sys.stdin.readline().replace("\n", "")
                if value == str(line[9]):
                    result[0] += 1
                    print("Correct!")
                else: 
                    result[1] += 1
                    print("Fail")
                result[2] += 1
                print("acc: " + str(result[0]/result[2]))
                corr_file.write(str(result[0]) + " " + str(result[1]) + " " + str(result[2]))
