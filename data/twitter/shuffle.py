import random
with open('ns_dataset.txt','r') as source:
    data = [ (random.random(), line) for line in source ]
data.sort()
with open('ns_shuffled_dataset.txt','w') as target:
    for _, line in data:
        target.write( line )