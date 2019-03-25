import pandas
import matplotlib.pyplot as plt
from sklearn import model_selection
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
import random
from sklearn.metrics import accuracy_score
import pickle

data = []
data_labels = []
with open('text/all.txt') as datafile:
    for index, line in enumerate(datafile):
        data.append(line.split('__')[2][1:])
        data_labels.append(line.split('__')[2][:1])

vectorizer = CountVectorizer(analyzer = 'word', lowercase = False)
features = vectorizer.fit_transform(data)
features_nd = features.toarray()

X_train, X_test, y_train, y_test  = train_test_split(
        features_nd, 
        data_labels,
        test_size=0.20,
        random_state=0)

log_model = LogisticRegression().fit(X=X_train, y=y_train) #training

y_pred = log_model.predict(X_test) #testing

accuracy = accuracy_score(y_test, y_pred)

print(str(round(accuracy*100, 3)) + "%")
#pickle.dump(log_model, open('mymodel.sav', 'wb'))


def word_feats(words):
    return dict([(word, True) for word in words])

# Predict
neg = 0
pos = 0
sentence = "Herlig film. Jeg likte den"
sentence = sentence.lower()
words = sentence.split(' ')
for word in words:
    classResult = log_model.classify( word_feats(word))
    if classResult == 'neg':
        neg = neg + 1
    elif classResult == 'pos':
        pos = pos + 1

print('Positive: ' + str(float(pos)/len(words)))
print('Negative: ' + str(float(neg)/len(words)))




