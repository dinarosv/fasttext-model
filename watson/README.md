# IBM Watson
IBM Watson offers a lot of services for machine learning. Two of those are Natural Language Understanding (NLU) and a Language Translator. These are already trained models which can be used to find the sentiment of a text and the other to translate language.
___
## Result
We tried to send 5000 lines of text from the [Amazon dataset](https://www.kaggle.com/bittlingmayer/amazonreviews) to the NLU in separate calls because you can only get one sentiment for each call. We got just over 4000 back before an error returned with Internal Server Error. 

We then used our watsontesting.py script to check how many the NLU succeeded to analyze compared to the correct sentiments.

We got a result of 85% accuracy. With fastText trained with Amazon we got 94% precision on the same testset (4000 lines). 

---
## How to make IBM Cloud account
To use IBM Watson's services you have to create an [IBM Cloud account](https://cloud.ibm.com/login). Then you have to create a NLU service with your account. This is free of charge for a Lite plan. Then follow IBM's further instructions which includes an apikey and a weblink.

### Install Watson developer cloud
IBM Watson API for development: [Github Watson-developer-cloud](https://github.com/watson-developer-cloud/python-sdk/tree/master/watson_developer_cloud).
```
$ pip install watson-developer-cloud
```
Now you can import the library with
```
import watson-developer-cloud
```

---


