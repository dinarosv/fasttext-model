# fastText modell med NoReC

Modellen bruker det norske datasettet [NoReC](https://github.com/ltgoslo/norec) for å trene opp en supervised modell basert på
fastText. Den bruker funksjonen train_supervised() fra fastTexts pythonbibliotek, med parameterene:

| Epoch | Learning rate | wordNgrams | minCount | dim | bucket   | loss | neg | ws | verbose | minn | maxn |
|-------|---------------|------------|----------|-----|----------|------|-----|----|---------|------|------|
| 30    | 0.4           | 5          | 5        | 10  | 20000000 | "ns" | 30  | 10 | 2       | 5    | 6    |

Dette ga precision at one (P@1) 65%.

For å teste modellen må du klone prosjektet, kjøre trainmodel.py og deretter testmodel.py i terminalen. 

## Struktur

```
MyModel
├── data (Fra NoReC)
│   ├── conllu.tar.gz
│   ├── html.tar.gz
│   └── metadata.json
├── norec (Script for å prosessere NoReC, av NoReC)
│   ├── conllu.py
│   ├── main.py
│   └── misc.py
├── text (Alle tekstfiler)
│   ├── bestparameteres.txt
│   ├── en_result.txt
│   ├── en_validation.txt
│   ├── otherdata.txt
│   ├── stopwords.txt
│   ├── test.txt
│   ├── testondoc.txt
│   └── train.txt
├── watson (Script for å teste med watson. Krever IBM Cloud konto)
│   ├── watsontesting.py
│   ├── watsontranslate.py
│   └── watsonvalidate.py
├── preprocessing.py
├── trainmodel.py
└── testmodel.py
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
