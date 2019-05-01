import random
with open('mixed.txt','r') as source:
    data = [ (random.random(), line) for line in source]
data.sort()
with open('mixed_shuffled.txt','w') as target:
    for _, line in data:
        target.write( line )