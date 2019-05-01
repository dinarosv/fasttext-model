import fs from 'fs';
import readline from 'readline';
import Stream from 'stream';
import cp from 'cli-progress';
import { stemWord } from './snowball_no';

if (!fs.existsSync(__dirname + '/ns_dataset.txt'))
  throw new Error('NO ns_dataset.txt found');

const bar = new cp.Bar({
  barCompleteChar: '=',
  barIncompleteChar: ' ',
  fps: 10,
  stream: process.stdout,
  barsize: 40,
  position: 'center',
});

let numLines = 0;

fs.createReadStream(__dirname + '/ns_dataset.txt').on('data', (data) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i] == 10)
      numLines++;
  }
}).on('error', e => console.error(e)).on('end', () => {
  bar.start(numLines, 0);
  fs.writeFileSync(__dirname + '/dataset.txt', '');
  const r = readline.createInterface(fs.createReadStream(__dirname + '/ns_dataset.txt', new Stream()));
  r.on('line', (line) => {
    bar.increment(1);
    const tokens = line.split(' ');
    const text = tokens.slice(1).filter(w => w.length > 1 || w === 'i').map(w => stemWord(w.replace(/[^a-zA-Z0-9æøåÆØÅ]/g, ''))).join(' ');
    fs.appendFile(__dirname + '/dataset.txt', `${tokens[0]} ${text}\n`, () => {});
  });

  r.on('close', () => {
    bar.update(numLines);
    bar.stop();
  });

  r.on('error', e => console.error(e));
});
