import fs from 'fs';
import readline from 'readline';
import Stream from 'stream';
import cp from 'cli-progress';

const bar = new cp.Bar({
  barCompleteChar: '=',
  barIncompleteChar: ' ',
  fps: 10,
  stream: process.stdout,
  barsize: 40,
  position: 'center',
});

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

args['--mix-files'] = args['--mix-files'].map(p => p.replace(':', '/'));

console.log(args);
console.log(__dirname + '/../norec/train.txt');

args['--mix-files'].forEach(e => {
  if (!fs.existsSync(__dirname + '/../' + e))
    throw new Error('Need norec and twitter stemmed and non stemmed to run');
});

const mix = {};

Promise.all(args['--mix-files'].map(path => new Promise((resolve, reject) => {
  mix[path] = [];
  const rl = readline.createInterface(fs.createReadStream(__dirname + '/../' + path), new Stream());

  rl.on('line', (line) => {
    mix[path].push(line);
  });

  rl.on('close', resolve);

  rl.on('error', reject);
}))).then(() => {
  let csvLength = 0;
  Object.keys(mix).forEach(p => {
    csvLength = mix[p][0].split(';').length > csvLength ? mix[p][0].split(';').length : csvLength;
  });
  if (csvLength < 2)
    csvLength = 2;
  Object.keys(mix).forEach(path => {
    mix[path] = mix[path].map(e => {
      if (path.indexOf('norec') > -1) {
        let text = e.split(' ');
        let a = '';
        for (let i = 2; i < csvLength; i++) {
          a += ';';
        }
        return text[0] + ';' + text.slice(1).join(' ') + a;
      }
      else {
        let text = e.split(';');
        if (text.length === csvLength)
          return e;
        let a = '';
        for (let i = text.length; i < csvLength; i++) {
          a += ';';
        }
        return e + a;
      }
    }).filter(e => e.indexOf('sentiment;text;date;username;location;follower_count;favorite_count;retweet_count;verified;result_type') === -1);
  });
  let nl = 0;
  Object.keys(mix).forEach(path => {
    nl += mix[path].length;
  });
  let ml = {};
  let prog = 0;
  console.log(nl);
  bar.start(nl, 0);
  fs.writeFileSync(__dirname + '/mixed.txt', 'sentiment;text;date;username;location;follower_count;favorite_count;retweet_count;verified;result_type');
  let output = '';
  for (let i = 0; i < nl; i++) {
    const p = Object.keys(mix)[Math.floor(Math.random() * Object.keys(mix).length)];
    if (!ml[p])
      ml[p] = 0;
    output += `\n${mix[p][ml[p]]}`
    bar.increment(1);
    ml[p]++;
    if (mix[p].length === ml[p])
      delete mix[p];
  }
  bar.stop();
  fs.appendFile(__dirname + '/mixed.txt', output, () => {});
}).catch(console.error);
