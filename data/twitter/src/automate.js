import { spawn } from 'child_process';

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

console.log(args);

let last_run = 0;
let ws;

const interval = 16 * 60 * 1000;

const f = () => {
  if (ws)
    return;
  if (new Date().getTime() - last_run < interval) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const time = Math.floor((interval - new Date().getTime() + last_run) / 1000);
    return process.stdout.write(`Time till next run: ${Math.floor(time / 60)}min ${time - (Math.floor(time / 60) * 60)}s`);
  }
  const a = ['run', 'tf', '--', '--automation'];
  if (args['-n'])
    a.push('-n', args['-n']);
  else
    a.push('-n', '40000');
  if (args['--cache'])
    a.push('--cache', args['--cache']);
  if (args['--ignore-new'])
    a.push('--ignore-new');
  console.log('Fetching tweets');
  ws = spawn('npm', a);
  ws.stdout.on('data', (data) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(data);
  });
  ws.stderr.pipe(process.stderr);
  ws.on('close', () => {
    console.log('Tweets fetched');
    const arg = ['run', 'ta', '--'];
    if (args['--input-file'])
      arg.push('--input-file', args['--input-file']);
    else
      arg.push('--input-file', 'tweets.txt');
    if (args['--output-file'])
      arg.push('--output-file', args['--output-file']);
    else
      arg.push('--output-file', 'dataset.txt');
    if (args['--cache'])
      arg.push('--cache', args['--cache']);
    if (args['--rand-oversampling-num'] && args['--rand-oversampling-num'].length > 0) {
      arg.push('--rand-oversampling-num');
      args['--rand-oversampling-num'].forEach(e => arg.push(e));
    }
    if (args['--rand-oversampling-labels'] && args['--rand-oversampling-labels'].length > 0) {
      arg.push('--rand-oversampling-labels');
      args['--rand-oversampling-labels'].forEach(e => arg.push(e));
    }
    console.log(arg);
    console.log('Analyzing tweets');
    ws = spawn('npm', arg);
    ws.stdout.on('data', (text) => {
      console.log(text.toString('utf-8'));
    });
    ws.on('close', () => {
      console.log('Analysis finished');
        ws = undefined;
    });
    last_run = new Date().getTime();
  });
};

setInterval(f, 1000);
f();
