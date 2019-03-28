import json
import os
from watson_developer_cloud import NaturalLanguageUnderstandingV1, LanguageTranslatorV3
from watson_developer_cloud.natural_language_understanding_v1 import Features, SentimentOptions
from apikeys import apikeyvalid

if __name__ == "__main__":
    nlu = NaturalLanguageUnderstandingV1(
        version='2018-11-16',
        iam_apikey=apikeyvalid,
        url='https://gateway-lon.watsonplatform.net/natural-language-understanding/api'
    )
    with open('text/en_validation.txt') as infile:
        with open('text/en_result.txt', 'w') as outfile:
            for index, line in enumerate(infile):
                response = nlu.analyze(
                    text=line,
                    features=Features(sentiment=SentimentOptions())).get_result()
                print(json.dumps(response, indent=2))
                label = response["sentiment"]["document"]["label"]
                if label == "positive":
                    outfile.write("__label__6 "+line)
                elif label == "negative":
                    outfile.write("__label__1 "+line)
                else:
                    outfile.write("__label__3 "+line)
                if index == 100:
                    break
