import json
import os
from watson_developer_cloud import NaturalLanguageUnderstandingV1, LanguageTranslatorV3
from watson_developer_cloud.natural_language_understanding_v1 import Features, SentimentOptions
from apikeys import apikeyvalid
import time

if __name__ == "__main__":
    nlu = NaturalLanguageUnderstandingV1(
        version='2018-11-16',
        iam_apikey=apikeyvalid,
        url='https://gateway-lon.watsonplatform.net/natural-language-understanding/api'
    )
    
    with open('../data/amazon/testfile.txt') as infile:
        with open('../data/amazon/results.txt', 'a') as outfile:
            for index, line in enumerate(infile):
                if index > 0 and index < 4000:
                    val = line.replace(line.split(' ')[0], "")
                    val = val[1:]
                    response = nlu.analyze(
                        text=val,
                        features=Features(sentiment=SentimentOptions()),
                        language='en').get_result()
                    score = response["sentiment"]["document"]["score"]
                    if score > 0:
                        outfile.write("__label__2 "+val)
                    else:
                        outfile.write("__label__1 "+val)