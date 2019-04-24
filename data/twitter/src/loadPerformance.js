import fs from 'fs';
import readline from 'readline';
import Stream from 'stream';

export default () => new Promise((resolve, reject) => {
  if (!fs.existsSync(__dirname + '/../.performance'))
    return resolve([]);
  const rl = readline.createInterface(fs.createReadStream(__dirname + '/../.performance', new Stream()));
  const lib = [];
  rl.on('line', (line) => {
    lib.push(line);
  });

  rl.on('close', () => {
    resolve(lib.filter(l => l !== ''));
  });

  rl.on('error', e => reject(e));
});
