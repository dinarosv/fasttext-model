# fastText modell med NoReC

Modellen bruker det norske datasettet [NoReC](https://github.com/ltgoslo/norec) for å trene opp en supervised modell basert på
fastText. Den bruker funksjonen train_supervised() fra fastTexts pythonbibliotek, med parameterene:

| Epoch | Learning rate | wordNgrams | minCount | dim | bucket   | loss | neg | ws | verbose | minn | maxn |
|-------|---------------|------------|----------|-----|----------|------|-----|----|---------|------|------|
| 25    | 0.25           | 5          | 5        | 10  | 2000000 | "ns" | 30  | 10 | 2       | 5    | 6    |

Dette ga precision at one (P@1) 71%.

## Struktur

```
MyModel
├── best_params
│   ├── amazon.txt
│   ├── norec_twolabels.txt
│   └── twitter_no.txt
├── data
│   ├── preprocessing.py
│   └── README.md
├── norec
│   ├── conllu.py
│   ├── main.py
│   ├── misc.py
│   └── README.md
├── watson
│   ├── watsontesting.py
│   ├── watsontranslate.py
│   ├── watsonvalidate.py
│   └── README.md
├── .gitignore
├── preprocessing.py
├── testenglishmodel.py
├── testmodel.py
├── trainmodel.py
├── twitterprep.py
└── README.md
```

## Bibliotek

### fastText
FastText API for python. [Github fastText](https://github.com/facebookresearch/fastText/tree/master/python)
```
$ pip install fasttext
```
Nå kan du importere biblioteket med
```
import fastText
```

### Watson developer cloud
IBM Watson API for utvikling. [Github Watson-developer-cloud](https://github.com/watson-developer-cloud/python-sdk/tree/master/watson_developer_cloud)
```
$ pip install watson-developer-cloud
```
Nå kan du importere biblioteket med
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
