# Norwegian tweets
This package fetches and annotate norwegian tweets based on the emojis used in the tweet.

## Usage
The package consists of three commands for automation, or performing the different tasks seperate from eachother.
The scripts use 3 labels for annotating the data:
- `__label__1 (Negative)`
- `__label__3 (Nutral)`
- `__label__6 (Positive)`


### Automation
Start an automated process for fetching and analyzing tweets.
```bash
npm start
```
or if supplying arguments
```bash
npm start -- [arguments]
```

#### Argument list
```
-n <number-of-tweets>                 Default: 40000
--cache <cache-folder>                Default: ./cache
--input-file <filename-for-tweets>    Default: tweets.txt
--output-file <output-dataset>        Default: dataset.txt
--ignore-new
--rand-oversampling-num <list-of-oversampling-sample-size>
--rand-oversampling-labels <list-of-oversampling-labels>
```

### Fetching tweets
This command fetches the tweets not yet cached, saves them in the `cache/tweets.txt` and updates stats.json for reference to what tweets already cached.
```bash
npm run tf -- -n <number-of-tweets> [other-arguments]
```

#### Argument list
```
--cache <cache-folder>    Default: ./cache
--ignore-new
```

### Analyzing tweets
This command fetches the tweets not yet cached, saves them in the `cache/tweets.txt` and updates stats.json for reference to what tweets already cached.
```bash
npm run ta -- --input-file <filename-of-tweets-relative-to-cache> --output-file <output-dataset> [other-arguments]
```

#### Argument list
```
--cache <cache-folder>    Default: ./cache
--rand-oversampling-num <list-of-oversampling-sample-size>
--rand-oversampling-labels <list-of-oversampling-labels>
```
