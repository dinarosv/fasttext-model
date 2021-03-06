# fastText model with NoReC and other datasets

Train a supervised model with the norwegian dataset [NoReC](https://github.com/ltgoslo/norec) using fastText. We used fastText's python library function train_supervised() with the parameteres:

| Epoch | Learning rate | wordNgrams | minCount | dim | bucket   | loss | ws | verbose | minn | maxn |
|-------|---------------|------------|----------|-----|----------|------|-----|----|---------|------|------|
| 25    | 0.25           | 3          | 2        | 10  | 2000000 | "softmax" | 5  | 5    | 6    |

This resulted in precision at one (P@1) 71%.

## Project structure

```
MyModel
├── data
│   ├── amazon
│   ├── english_tweets
│   ├── norec
│   │   ├── scripts
│   │   │   └── README.md (How to use norec scripts)
│   │   └── README.md (How to download norec)
│   ├── sentiment_lexicons
│   ├── stopwords
│   ├── tn_mixed (Twitter / Norec mixed)
│   ├── twitter
│   │   ├── dataset.txt (This is the norwegian twitter dataset)
│   │   ├── README.md (How to use our norwegian twitter dataset)
│   └── README.md (How to download all datasets)
├── watson
│   └── README.md
├── testmodel_twolabels.py
├── testmodel.py
├── trainmodel.py
└── README.md
```

## Usage
To train a model the `trainmodel.py` file use the training dataset to train the model, and test dataset for testing of the models performance.
```
python3 trainmodel.py <train dataset> <test dataset> <model filename>.bin
```

## Libraries

### fastText
FastText API for python. [Github fastText](https://github.com/facebookresearch/fastText/tree/master/python)
```
$ pip install fasttext
```
Now you can import the library with
```
import fastText
```

### Watson developer cloud
IBM Watson API for development. [Github Watson-developer-cloud](https://github.com/watson-developer-cloud/python-sdk/tree/master/watson_developer_cloud)
```
$ pip install watson-developer-cloud
```
Now you can import the library with
```
import watson-developer-cloud
```

### Python modules
```
import os
import time
import sys
import string
import csv
import re
import json
```

## Dataset
All the following datasets are described in  `data/README.md`.
- NoReC: The Norwegian Review Corpus
- Amazon Reviews for Sentiment Analysis
- Twitter US Airline Sentiment
- Sentiment Lexicons for 81 languages
- Norwegian Stopwords
- Norwegian Tweets
