import json
from watson_developer_cloud import NaturalLanguageUnderstandingV1, LanguageTranslatorV3
from apikeys import apikeytrans

if __name__ == "__main__":
    translator = LanguageTranslatorV3(
    version='2018-05-01',
    iam_apikey=apikeytrans,
    url='https://gateway-lon.watsonplatform.net/language-translator/api')

    
    with open('text/en_validation.txt', 'w') as outfile:
        with open("text/validation.txt") as infile:
            table = []
            for index, line in enumerate(infile):
                data = line.split('__')[2][1:]
                table.append(data)
                if index == 35 or index == 70 or index == 105:
                    raw_translations = translator.translate(
                        text=table,
                        model_id='nb-en').get_result()
                    table = []
                    for item in raw_translations["translations"]:
                        outfile.write(item["translation"])
                if index == 105:
                    break



#translation = translator.translate(
#    text='hallo jeg heter dina',
#    model_id='nb-en').get_result()
#print(json.dumps(translation, indent=2, ensure_ascii=False))
