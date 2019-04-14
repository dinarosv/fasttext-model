import fs from 'fs';
import readline from 'readline';
import stream from 'stream';
import cp from 'cli-progress';
import { stemWord } from './snowball_no';

const list = [];

export default wordlistFiles => new Promise((resolve, reject) => {
  if (!wordlistFiles || wordlistFiles.length === 0 || typeof wordlistFiles !== 'object')
    return reject(new Error('Error: No wordlist file specified'));
  if (fs.existsSync(`${__dirname}/../${wordlistFiles.join('')}`)) {
    readList(wordlistFiles.join('')).then(() => {
      resolve(list);
    });
  }
  else {
    const promiseArr = [];
    for (let i = 0; i < wordlistFiles.length; i++) {
      promiseArr.push(readList(wordlistFiles[i]));
    }

    Promise.all(promiseArr).then((data) => {
      const progress = new cp.Bar({
        barCompleteChar: '=',
        barIncompleteChar: ' ',
        fps: 10,
        stream: process.stdout,
        barsize: 40,
        position: 'center',
      });
      progress.start(list.length, 0);
      const newList = list.map(elm => stemWord(elm).toLowerCase()).filter((elm, i) => {
        progress.increment(1);
        return list.indexOf(elm) === i && elm.length > 2;
      });
      progress.stop();
      console.log(`Original list length: ${list.length}`);
      console.log(`New list length: ${newList.length}`);
      console.log(`List diff: ${list.length - newList.length}`);
      fs.writeFile(`${__dirname}/../${wordlistFiles.join('')}`, newList.reduce((acc, val) => `${acc}\n${val}`, ''), () => {});
      resolve(newList);
    }).catch(reject);
  }
});

const readList = file => new Promise((resolve, reject) => {
  const rl = readline.createInterface(fs.createReadStream(`${__dirname}/../${file}`), new stream());

  rl.on('line', (line) => {
    list.push(line);
  });

  rl.on('close', () => {
    resolve(file);
  });

  rl.on('error', e => reject(e));
});
