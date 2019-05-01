import random
with open('dataset.txt','r') as source:
    data = [ (random.random(), line) for line in source ]
data.sort()
with open('shuffled_dataset.txt','w') as target:
    for _, line in data:
        target.write( line )