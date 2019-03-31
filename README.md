# fastText modell med NoReC og andre datasett

Train a supervised model with the norwegian dataset [NoReC](https://github.com/ltgoslo/norec) using fastText. We used fastText's python library function train_supervised() with the parameteres:

| Epoch | Learning rate | wordNgrams | minCount | dim | bucket   | loss | neg | ws | verbose | minn | maxn |
|-------|---------------|------------|----------|-----|----------|------|-----|----|---------|------|------|
| 25    | 0.25           | 5          | 5        | 10  | 2000000 | "ns" | 30  | 10 | 2       | 5    | 6    |

This resulted in precision at one (P@1) 71%.

## Struktur

```
MyModel
├── data
│   ├── amazon
│   ├── english_tweets
│   │   └── preprocess_tweets.py
│   ├── norec
│   │   ├── scripts
│   │   │   ├── conllu.py
│   │   │   ├── main.py
│   │   │   ├── misc.py
│   │   │   └── README.md (How to use norec scripts)
│   │   ├── norec_prep.py
│   │   └── README.md (How to download norec)
│   ├── sentiment_lexicons
│   ├── stopwords
│   ├── twitter
│   │   └── twitterprep.py
│   └── README.md (How to download all datasets)
├── watson
│   ├── watsontesting.py
│   ├── watsontranslate.py
│   ├── watsonvalidate.py
│   └── README.md
├── .gitignore
├── testmodel_twolabels.py
├── testmodel.py
├── trainmodel.py
└── README.md
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

### Moduler i python
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
All the following datasets are described in the directory "data"s README file.
- NoReC: The Norwegian Review Corpus
- Amazon Reviews for Sentiment Analysis
- Twitter US Airline Sentiment
- Sentiment Lexicons for 81 languages
- Norwegian Stopwords
- Norwegian Tweets
