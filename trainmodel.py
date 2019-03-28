from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from fastText import train_supervised
import os
import time

epoch=30         # number of loops through same example {5} [5 - 50]
lr=0.4         # learning rate {0.05, 0.1, 0.25, 0.5} [0 - 1] {0.05}
wordNgrams=5    # relation to surrounding words [1 - 5]
minCount=5      # minimal number of word occurrences {5}
dim=10          # dimension of vectors {100}
bucket=2000000 # number of buckets {2000000}
thread=3       # threads
loss="ns"       # loss function {ns, hs, softmax} [ns]
neg=30           # number of negatives sampled {5}
ws=10            # window size {5}
verbose=2       # verbosity level {2}
minn=5          # min length of char ngram [3]
maxn=6          # max length of char ngram [6]

params_string = (
        "Epoch=" + str(epoch) + 
        " lr=" + str(lr) + 
        " Ngrams=" + str(wordNgrams) + 
        " mincount=" + str(minCount) +
        " dim=" + str(dim) + 
        " bucket=" + str(bucket) +
        " loss=" + str(loss) +
        " neg=" + str(neg) +
        " ws=" + str(ws) +
        " verbose=" + str(verbose) +
        " minn=" + str(minn) + 
        " maxn=" + str(maxn)
    )

# Print the precision and save parameteres to file if precision is over 76%
def print_results(N, p, r):
    print("Examples:\t" + str(N))
    print("Precision:\t" + str(round(p*100, 2)) + " %")
    if p > 0.76:
        with open('text/bestparameters.txt', 'a') as infile:
            infile.write(str(round(p*100, 2)) + " --- " + params_string + "\n")

if __name__ == "__main__":
    start = time.time()

    #Path to train and test data
    train_data = os.path.join(os.getenv("DATADIR", ''), 'text/train.txt')
    valid_data = os.path.join(os.getenv("DATADIR", ''), 'text/test.txt')

    print('\033[1m'+params_string+'\033[0m')

    # Fasttext's supervised training function
    model = train_supervised(
        input=train_data, 
        epoch=epoch, 
        lr=lr, 
        wordNgrams=wordNgrams,
        minCount=minCount,
        dim=dim,
        thread=thread,
        bucket=bucket,
        loss=loss,
        neg=neg,
        ws=ws,
        verbose=verbose,
        minn=minn,
        maxn=maxn
    )

    print_results(*model.test(valid_data))
    
    #print("Quantizing: ")
    #model.quantize(input=train_data, qnorm=True, retrain=True, cutoff=100000)

    model.save_model("model.bin")

    end = time.time()

    total = end-start
    print("Time training:\t" + str(round(total,1)) + "s")

    