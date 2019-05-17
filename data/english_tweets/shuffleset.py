import random
with open('even_dataset.txt','r') as source:
    data = [ (random.random(), line) for line in source ]
data.sort()
with open('sdataset.txt','w') as target:
    for _, line in data:
        target.write( line )