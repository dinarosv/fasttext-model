import fs from 'fs';
import readline from 'readline';
import Stream from 'stream';

export default () => new Promise((resolve, reject) => {
  const rl = readline.createInterface(fs.createReadStream(__dirname + '/../../sentiment_lexicons/lexicon_no.txt', new Stream()));
  const lexicon = {};
  rl.on('line', (line) => {
    const words = line.split(' ');
    lexicon[words[1]] = words[0] === '__label__6' ? 1 : -1;
  });

  rl.on('close', () => {
    resolve(lexicon);
  });

  rl.on('error', e => reject(e));
});
