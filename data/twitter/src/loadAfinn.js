import fs from 'fs';
import readline from 'readline';
import stream from 'stream';
import { stemWord } from './snowball_no';

export default () => new Promise((resolve, reject) => {
  const rl = readline.createInterface(fs.createReadStream(`${__dirname}/../afinn_no.txt`), new stream());
  const afinn = [];

  rl.on('line', (line) => {
    const split = line.split('\t');
    afinn.push(split[0], Number(split[1]) / 5);
  });

  rl.on('close', () => {
    const ret = {};
    for (let i = 0; i < afinn.length; i += 2) {
      if (afinn.indexOf(afinn[i]) === i)
        ret[afinn[i]] = afinn[i + 1];
    }
    console.log(`AFINN Original: ${afinn.length / 2}\nAFINN New: ${Object.keys(ret).length}`);
    resolve(ret);
  });

  rl.on('error', e => reject(e));
});
