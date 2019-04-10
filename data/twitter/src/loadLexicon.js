import fs from 'fs';
import readline from 'readline';
import Stream from 'stream';
import { stemWord } from './snowball_no';

export default () => new Promise((resolve, reject) => {
  const rl = readline.createInterface(fs.createReadStream(__dirname + '/../../sentiment_lexicons/lexicon_no.txt', new Stream()));
  const lexicon = [];
  rl.on('line', (line) => {
    const words = line.split(' ');
    lexicon.push(words[1], words[0] === '__label__6' ? 0.5 : -0.5);
  });

  rl.on('close', () => {
    const ret = {};
    for (let i = 0; i < lexicon.length; i += 2) {
      if (lexicon.indexOf(lexicon[i]) === i)
        ret[lexicon[i]] = lexicon[i + 1];
    }
    console.log(`LEXICON Original: ${lexicon.length}\nLEXICON New: ${Object.keys(ret).length}`);
    resolve(ret);
  });

  rl.on('error', e => reject(e));
});
