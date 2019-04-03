import fs from 'fs';
import emojis from 'emoji-sentiment';
import cp from 'cli-progress';
import readline from 'readline';
import stream from 'stream';
import loadLexicon from './loadLexicon';

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

Object.keys(args).forEach((key) => {
  if (typeof args[key] === 'string' && args[key].indexOf(' ') > -1)
    args[key] = args[key].split(' ');
});

if (!args['--output-file'] || typeof args['--output-file'] !== 'string' || !args['--input-file'] || typeof args['--input-file'] !== 'string')
  throw new Error('Error: must have --output-file and --input-file flags');

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

args['--cache'] = `/..${args['--cache']}`;
args['--output-file'] = `/..${args['--output-file']}`;

const es = {};
emojis.forEach(e => es[e.sequence.toLowerCase()] = e);

let numLines = 0;
const progress = new cp.Bar({
  barCompleteChar: '=',
  barIncompleteChar: ' ',
  fps: 10,
  stream: process.stdout,
  barsize: 40,
  position: 'center',
});
loadLexicon().then((lexicon) => {
  fs.createReadStream(__dirname + args['--cache'] + args['--input-file']).on('data', (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i] == 10)
        numLines++;
    }
  }).on('error', e => console.error(e)).on('end', () => {
    fs.writeFileSync(__dirname + args['--output-file'], '');
    progress.start(numLines, 0);
    const rl = readline.createInterface(fs.createReadStream(__dirname + args['--cache'] + args['--input-file']), new stream());

    const spread = {};
    rl.on('line', (text) => {
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
        sentiment = '__label__6';
      else if (avg > -0.3)
        sentiment = '__label__3';
      else
        sentiment = '__label__1';
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
        progress.increment(1);
      });
    });

    rl.on('close', () => {
      progress.update(numLines);
      progress.stop();
      console.log('Label spread');
      Object.keys(spread).forEach(label => console.log(`${label}: ${spread[label]}`));
    });

    rl.on('error', e => console.error(e));
  });
});
