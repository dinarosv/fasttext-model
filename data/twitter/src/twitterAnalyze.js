import fs from 'fs';
import emojis from 'emoji-sentiment';
import cp from 'cli-progress';
import readline from 'readline';
import stream from 'stream';
import loadLexicon from './loadLexicon';
import loadAfinn from './loadAfinn';
import loadWordlist from './loadWordlist';
import loadPerformance from './loadPerformance';
import { stemWord } from './snowball_no';

const as = process.argv.slice(2);
const args = {};

for (let i = 0; i < as.length; i++) {
  if (as[i].charAt(0) === '-')
    args[as[i]] = true;
  else if (as[i - 1].charAt(0) === '-')
    args[as[i - 1]] = as[i];
  else {
    for (let j = i; j >= 0; j--) {
      if (as[j].charAt(0) === '-') {
        args[as[j]] += ` ${as[i]}`;
        break;
      }
    }
  }
}

const msToString = (ms) => {
  const hrs = Math.floor(ms / (60 * 60 * 1000));
  ms -= hrs * 60 * 60 * 1000;
  const mins = Math.floor(ms / (60 * 1000));
  ms -= mins * 60 * 1000;
  const s = Math.floor(ms / 1000);
  return `${hrs}h ${mins}min ${s}s ${ms - s * 1000}ms`;
}

Object.keys(args).forEach((key) => {
  if (typeof args[key] === 'string' && args[key].indexOf(' ') > -1)
    args[key] = args[key].split(' ');
});

if (!args['--output-file'] || typeof args['--output-file'] !== 'string' || !args['--input-file'] || typeof args['--input-file'] !== 'string')
  throw new Error('Error: must have --output-file and --input-file flags');

args['--output-file-ns'] = `/../ns_${args['--output-file']}`;
if (args['--output-file'].charAt(0) !== '/')
  args['--output-file'] = `/${args['--output-file']}`;

if (!args['--rand-oversampling-num'])
  args['--rand-oversampling-num'] = [1, 10];
else if (typeof args['--rand-oversampling-num'] === 'string')
  args['--rand-oversampling-num'] = [Number(args['--rand-oversampling-num']), Number(args['--rand-oversampling-num'])];
else
  args['--rand-oversampling-num'] = args['--rand-oversampling-num'].map(e => Number(e));

if (!args['--rand-oversampling-labels'])
  args['--rand-oversampling-labels'] = [];

if (!args['--cache'])
  args['--cache'] = '/cache/';
if (args['--cache'].charAt(0) !== '/')
  args['--cache'] = `/${args['--cache']}`;
if (args['--cache'].charAt(args['--cache'].length - 1) !== '/')
  args['--cache'] = `${args['--cache']}/`;
if (!args['--wordlist'] || typeof args['--wordlist'] !== 'string')
  args['--wordlist'] = ['aspell.txt', 'afinn_no.txt', 'cursewords.txt', 'common_words.txt'];

args['--cache'] = `/..${args['--cache']}`;
args['--output-file'] = `/..${args['--output-file']}`;
if (!args['--buffer-file'])
  args['--buffer-file'] = '/../.buffer';
if (!args['--performance-file'])
  args['--performance-file'] = '/../.performance';
if (args['--limit'])
  args['--limit'] = Number(args['--limit']);
else
  args['--limit'] = Number.MAX_VALUE;

const es = {};
emojis.forEach(e => es[e.sequence.toLowerCase()] = e);

let numLines = 0;
let discardedTweets = 0;
let lexicon;
let wordlist;
let performance;
let afinn;
let afinn_keys;
const wFreq = {};
const startTime = new Date().getTime();
const spread = { '0': 0, '1': 0, '2': 0 };
let progress = (() => !args['--automation'] ? new cp.Bar({
  barCompleteChar: '=',
  barIncompleteChar: ' ',
  fps: 10,
  stream: process.stdout,
  barsize: 40,
  position: 'center',
}) : undefined)();

const analyze = () => {
  if (!args['--limit-analyze']) {
    Object.keys(spread).forEach(key => spread[key] = 0);
    progress = (() => !args['--automation'] ? new cp.Bar({
      barCompleteChar: '=',
      barIncompleteChar: ' ',
      fps: 10,
      stream: process.stdout,
      barsize: 40,
      position: 'center',
    }) : undefined)();
  }
  loadPerformance().then((perf) => {
    performance = perf;
    loadWordlist(args['--wordlist']).then((wl) => {
      wordlist = wl;
      loadAfinn().then((afl) => {
        afinn = afl;
        afinn_keys = Object.keys(afinn).sort((a, b) => b.length - a.length);
        loadLexicon().then((r) => {
          lexicon = r;
          numLines = 0;
          discardedTweets = 0;
          fs.createReadStream(__dirname + args['--cache'] + args['--input-file']).on('data', (data) => {
            for (let i = 0; i < data.length; i++) {
              if (data[i] == 10)
                numLines++;
            }
          }).on('error', e => console.error(e)).on('end', () => {
            fs.writeFileSync(__dirname + (args['--limit-analyze'] ? args['--buffer-file'] : args['--output-file']), 'sentiment;text;date;username;location;follower_count;favorite_count;retweet_count;verified;result_type');
            if (!args['--automation'])
              progress.start(numLines, 0);
            const rl = readline.createInterface(fs.createReadStream(__dirname + args['--cache'] + args['--input-file']), new stream());

            rl.on('line', (tweet) => {
              if (Object.keys(spread).length > 0 && Object.keys(spread).filter(key => spread[key] < args['--limit']).length === 0)
                return rl.close();
              compAnalysis(tweet);
            });

            rl.on('close', () => {
              if (!args['--automation']) {
                progress.update(numLines);
                progress.stop();
              }
              fs.writeFile(__dirname + args['--performance-file'],
                Object.keys(wFreq)
                  .sort((a, b) => wFreq[b] - wFreq[a])
                  .reduce((acc, val) => `${acc}${val}\n`, '')
                , () => {});
              console.log('Label spread');
              console.log(spread);
              const s = Object.keys(spread).sort((a, b) => spread[a] - spread[b]);
              console.log(`Label separation: ${spread[s[s.length - 1]] - spread[s[0]]}\nLow: ${s[0]}\nHigh: ${s[s.length - 1]}`);
              console.log(`Discarded tweets: ${discardedTweets}`);
              if (args['--limit-analyze']) {
                const interTime = new Date().getTime();
                console.log(`First iteration: ${msToString(new Date().getTime() - startTime)}`)
                args['--limit'] = spread[Object.keys(spread).sort((a, b) => spread[a] - spread[b])[0]];
                Object.keys(spread).forEach(key => spread[key] = 0);
                progress = (() => !args['--automation'] ? new cp.Bar({
                  barCompleteChar: '=',
                  barIncompleteChar: ' ',
                  fps: 10,
                  stream: process.stdout,
                  barsize: 40,
                  position: 'center',
                }) : undefined)();
                fs.writeFileSync(__dirname + args['--output-file'], 'sentiment;text');
                if (args['--no-stemming'])
                  fs.writeFileSync(__dirname + args['--output-file-ns'], 'sentiment;text');
                numLines = 0;
                fs.createReadStream(__dirname + args['--buffer-file']).on('data', (data) => {
                  for (let i = 0; i < data.length; i++) {
                    if (data[i] == 10)
                      numLines++;
                  }
                }).on('error', e => console.error(e)).on('end', () => {
                  if (!args['--automation'])
                    progress.start(numLines, 0);
                  const r = readline.createInterface(fs.createReadStream(__dirname + args['--buffer-file']), new stream());

                  r.on('line', (tweet) => {
                    if (tweet.indexOf('sentiment;text') === 0 || Object.keys(spread).filter(key => spread[key] !== args['--limit']).length === 0)
                      return;
                    const sent = tweet.split(';')[0];
                    spread[sent]++;
                    if (!args['--automation'])
                      progress.increment(1);
                    if (spread[sent] <= args['--limit']) {
                      if (args['--no-stemming']) {
                        fs.appendFile(__dirname + args['--output-file-ns'], `\n${tweet}`, () => {});
                        let vals = tweet.split(';');
                        vals[1] = vals[1].split(' ').map(w => stemWord(w)).join(' ');
                        fs.appendFile(__dirname + args['--output-file'], `\n${vals.join(';')}`, () => {});
                      }
                      else
                        fs.appendFile(__dirname + args['--output-file'], `\n${tweet}`, () => {});
                    }
                    else
                      spread[sent] = args['--limit'];
                  });

                  r.on('close', () => {
                    progress.update(numLines);
                    progress.stop();
                    fs.unlink(__dirname + args['--buffer-file'], err => {
                      if (err)
                        console.error(err);
                    });
                    console.log(`Second iteration: ${msToString(new Date().getTime() - interTime)}`);
                    console.log(`Total: ${msToString(new Date().getTime() - startTime)}`);
                  });
                });
              }
              else
                console.log(msToString(new Date().getTime() - startTime));
            });

            rl.on('error', e => console.error(e));
          });
        });
      });
    });
  });
}


const compAnalysis = (tweet) => {
  let text = tweet.split(';')[0].toLowerCase();
  const meta = tweet.split(';').slice(1).join(';');
  let found = false;
  const textStemmed = text.split(' ').map(e => stemWord(e));
  let num = 0;
  for (let i = 0; i < performance.length; i++){
    if (textStemmed.filter(w => w.indexOf(performance[i]) > -1).length > 0) {
      num++
      if (!wFreq[performance[i]])
        wFreq[performance[i]] = 1;
      else
        wFreq[performance[i]]++;
    }
    if (num >= 2) {
      found = true;
      break;
    }
  }
  num = 0;
  if (!found) {
    for (let i = 0; i < wordlist.length; i++) {
      if (textStemmed.filter(w => w.indexOf(wordlist[i]) > -1).length > 0) {
        num++
        if (!wFreq[wordlist[i]])
          wFreq[wordlist[i]] = 1;
        else
          wFreq[wordlist[i]]++;
      }
      if (num >= 2) {
        found = true;
        break;
      }
    }
  }
  if (!found) {
    discardedTweets++;
    return;
  }
  const analysis = [];
  for (let i = 0; i < text.length; i++) {
    if (!text.codePointAt(i))
      continue;
    const point = text.codePointAt(i).toString(16);
    if (point.length < 4)
      continue;
    if (es[point]) {
      analysis.push(es[point]);
      text = text.slice(0, i) + text.slice(i + 2);
      i -= 2;
    }
  }
  if (text.length < 10) {
    if (!args['--automation'])
      progress.increment(1);
    return;
  }
  text = text.replace(/[.,;:\-_\?'\(\)\!\…]+/g, ' ').split(' ').filter(w => w !== '').join(' ');
  let dummyText = text;
  afinn_keys.forEach((phrase) => {
    let index = -1;
    if (phrase.indexOf(' '))
      index = dummyText.indexOf(phrase);
    else {
      index = dummyText.split(' ')[dummyText.split(' ').indexOf(phrase)];
      if (index === -1)
        return;
      let help = 0;
      for (let i = 0; i < index; i++) {
        help += index[i].length;
      }
      index = help + index - 1;
    }
    while (index > -1) {
      dummyText = dummyText.slice(0, index) + dummyText.slice(index + phrase.length);
      analysis.push({ score: afinn[phrase] });
      index = dummyText.indexOf(phrase);
      if (phrase.indexOf(' '))
        index = dummyText.indexOf(phrase);
      else {
        index = dummyText.split(' ')[dummyText.split(' ').indexOf(phrase)];
        if (index === -1)
          return;
        let help = 0;
        for (let i = 0; i < index; i++) {
          help += index[i].length;
        }
        index = help + index - 1;
      }
    }
  });
  dummyText.split(' ').forEach((word) => {
    if (lexicon[word])
      analysis.push({score: lexicon[word]});
  });
  text = text.replace(/#/g, ' ').split(' ').filter(w => w !== '');
  let sText = text.map(w => stemWord(w)).join(' ');
  text = text.join(' ');
  const avg = analysis.length === 0 ? 0 : analysis.reduce((acc, val) => acc + val.score, 0) / analysis.length;
  let sentiment = '';
  if (avg > Number(args['--interval']))
    sentiment = '2';
  else if (avg > -Number(args['--interval']))
    sentiment = '1';
  else
    sentiment = '0';
  let soutput = '';
  let output = '';
  if (args['--rand-oversampling-labels'].indexOf(sentiment) > -1) {
    const len = Math.floor(Math.random() * (args['--rand-oversampling-num'][1] - args['--rand-oversampling-num'][0])) + args['--rand-oversampling-num'][0];
    for (let i = 0; i < len; i++) {
      soutput += `\n${sentiment};${sText}`;
      output += `\n${sentiment};${text}`;
    }
    if (!spread[sentiment])
      spread[sentiment] = len;
    else
      spread[sentiment] += len;
  }
  else {
    soutput = `\n${sentiment};${sText}`;
    output += `\n${sentiment};${text}`;
    if (!spread[sentiment])
      spread[sentiment] = 1;
    else
      spread[sentiment]++;
  }
  fs.appendFile(__dirname + (args['--limit-analyze'] ? args['--buffer-file'] : args['--output-file']), args['--no-stemming'] && args['--limit-analyze'] ? output : soutput, () => {
    if (!args['--automation'])
      progress.increment(1);
  });
  if (args['--no-stemming'] && !args['--limit-analyze'])
    fs.appendFile(__dirname + args['--output-file-ns'], output, () => {});
}

const basicAnalysis = (text) => {
  const analysis = [];
  for (let i = 0; i < text.length; i++) {
    if (!text.codePointAt(i))
      continue;
    const point = text.codePointAt(i).toString(16);
    if (point.length < 4)
      continue;
    if (es[point]) {
      analysis.push(es[point]);
      text = text.slice(0, i) + text.slice(i + 2);
      i -= 2;
    }
  }
  if (text.length < 10)
    return;
  text.split(' ').forEach((word) => {
    if (lexicon[word])
      analysis.push({score: lexicon[word]});
  });
  const avg = analysis.reduce((acc, val) => acc + val.score, 0) / analysis.length;
  let sentiment = '';
  if (avg > 0.3)
    sentiment = '2';
  else if (avg > -0.3)
    sentiment = '1';
  else
    sentiment = '0';
  let output = '';
  if (args['--rand-oversampling-labels'].indexOf(sentiment) > -1) {
    const len = Math.floor(Math.random() * (args['--rand-oversampling-num'][1] - args['--rand-oversampling-num'][0])) + args['--rand-oversampling-num'][0];
    for (let i = 0; i < len; i++) {
      output += `${sentiment} ${text}\n`;
    }
    if (!spread[sentiment])
      spread[sentiment] = len;
    else
      spread[sentiment] += len;
  }
  else {
    output = `${sentiment} ${text}\n`;
    if (!spread[sentiment])
      spread[sentiment] = 1;
    else
      spread[sentiment]++;
  }
  fs.appendFile(__dirname + args['--output-file'], output, () => {
    if (!args['--automation'])
      progress.increment(1);
  });
}

analyze();
