# Different datasets in norwegian and english
This directory includes instructions on how to download and use different datasets which we used in our bachelor thesis at NTNU Trondheim.

## NoReC Dataset For Norwegian
Instructions are descriped in the directory "norec". 
You can find the whole repo here: https://github.com/ltgoslo/norec.

## Amazon Reviews for Sentiment Analysis
This dataset is processed by [Adam Bittlingmayer](https://www.kaggle.com/bittlingmayer) to make the reviews fit to fastText. You can download it from here: [Amazon reviews](https://www.kaggle.com/bittlingmayer/amazonreviews). The dataset does not contain neutral sentiment.

## Twitter US Airline Sentiment
Download the [Tweets.csv from kaggle.com](https://www.kaggle.com/crowdflower/twitter-airline-sentiment) and move it to the directory "english_tweets" to run the preprocess_tweets.py. That will create two files: train.txt and text.txt. You can then run trainmodel.py from the root directory.

## Sentiment Lexicons for 81 languages
This dataset by [Rachael Tatman](https://www.kaggle.com/rtatman) labeled single words positive or negative for 81 different languages. We used the norwegian dataset. You can download all from [Kaggle](https://www.kaggle.com/rtatman/sentiment-lexicons-for-81-languages). Notice you have to preprocess it to follow fastText's format before you can train a model. 

## Norwegian Stopwords
This file contains several stopwords in norwegian which can be used to remove unwanted words from a dataset. You can find the file here: [kmelve]( https://gist.github.com/kmelve/8869818). Notice some of the words could contain sentiment and possibly make your dataset less accurate.

## Norwegian Tweets
This dataset we fetched on our own using [Twitter's API](https://developer.twitter.com). A tip is to see how the distribution of positive and negative tweets is, and then use random oversampling to even out. We used only the tweets containing emojis and then found a list of sentiment for each emoji by [Department of Knowledge Technologies](http://kt.ijs.si/data/Emoji_sentiment_ranking/) which we used to label each tweet. 