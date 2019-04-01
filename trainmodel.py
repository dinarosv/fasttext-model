from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import fastText
from fastText import train_supervised
import os
import time
import sys


# Arguments: Trainfile, testfile, model, bestparameteres

hyper_params = {
    "epoch": 50,        # number of loops through same example {5} [5 - 50]
    "lr": 0.15,          # learning rate {0.05, 0.1, 0.25, 0.5} [0 - 1] {0.05}
    "wordNgrams": 5,    # relation to surrounding words [1 - 5]
    "minCount": 3,      # minimal number of word occurrences {5}
    "dim": 10,           # dimension of vectors {100}
    "bucket": 1000000,  # number of buckets {2000000}
    "thread": 3,        # threads
    "loss": "ns",       # loss function {ns, hs, softmax} [ns]
    "neg": 1,          # number of negatives sampled {5}
    "ws": 10,            # window size {5}
    "verbose": 6,       # verbosity level {2}
    "minn": 3,          # min length of char ngram [3]
    "maxn": 6           # max length of char ngram [6]
}

# Print the precision and save parameteres to file if precision is over 76%
def print_results(N, p, r):
    print("Examples:\t" + str(N))
    print("Precision:\t" + str(round(p*100, 2)) + " %")
    paramfile = sys.argv[4] if len(sys.argv) > 5 else "text/bestparameters"
    if p > 0.52:
        with open(paramfile, 'a') as infile:
            infile.write(str(round(p, 3)) + " " + str(hyper_params) + "\n")

if __name__ == "__main__":
    start = time.time()

    length = len(sys.argv)
    trainfile = sys.argv[1] if length > 2 else "data/norec/train.txt"
    testfile = sys.argv[2] if length > 3 else "data/norec/test.txt"
    modelfile = sys.argv[3] if length > 4 else "models/model.bin"

    # Path to train and test data
    train_data = os.path.join(os.getenv("DATADIR", ''), trainfile)
    valid_data = os.path.join(os.getenv("DATADIR", ''), testfile)

    print('\033[1m'+str(hyper_params).strip("{}").replace("'", "")+'\033[0m')

    # Fasttext's supervised training function
    model = train_supervised(
        input=train_data, 
        **hyper_params
    )

    print_results(*model.test(valid_data))
    
    # print("Quantizing: ")
    # model.quantize(input=train_data, qnorm=True, retrain=True, cutoff=100000)

    model.save_model(modelfile)

    end = time.time()

    total = end-start
    print("Time training:\t" + str(round(total,1)) + "s")

    