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
    
    #with open('../data/amazon/cuttest.ft.txt') as infile:
    #with open('../data/amazon/result_wat.txt', 'a') as outfile:
    start = time.time()
    #for index, line in enumerate(infile):
    #if index > 28460 and index < 28507:
    #val = line.replace(line.split(' ')[0], "")
    #val = val[1:]
    response = nlu.analyze(
        text="I thought is wasn't good.: This is about a boy and a cricket. Mario, the boy, is working at a newsstand when he hears a noise. He looks under a trash can and finds a cricket. He buys a cage for the cricket, and that's how it turns out. The part I liked is when the cricket chirps and asks the man who was going to steal the bell what he was doing. I did not like the rest",
        features=Features(sentiment=SentimentOptions()),
        language='en').get_result()
    #print(json.dumps(response, indent=2))
    print(response)
    score = response["sentiment"]["document"]["score"]
    #if score > 0:
        #outfile.write("__label__2 "+val)
    #else:
        #outfile.write("__label__1 "+val)
    end = time.time()
    print("Time: " + str((end-start)) + " seconds")