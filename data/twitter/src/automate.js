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

let last_run = 0;
let ws;

const interval = (args['--interval'] && typeof args['--interval'] === 'string' ? Number(args['--interval']) : 16) * 60 * 1000;

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
  let finished = false;
  ws.stdout.on('data', (data) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(data);
    if (data.toString('utf-8').indexOf('Tweets processed: 0') > -1) {
      finished = true;
    }
  });
  ws.stderr.pipe(process.stderr);
  ws.on('close', () => {
    console.log('Tweets fetched');
    last_run = new Date().getTime();
    if (args['--no-analysis']) {
      ws = undefined;
      console.log('Amount of data:');
      spawn('wc', ['-l', 'dataset.txt', 'cache/tweets.txt']).stdout.pipe(process.stdout);
      return;
    }
    const arg = ['run', 'ta', '--', '--automation'];
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
    console.log('Analyzing tweets');
    ws = spawn('npm', arg);
    ws.stdout.on('data', (text) => {
      console.log(text.toString('utf-8'));
    });
    ws.on('close', () => {
      console.log('Analysis finished');
      ws = undefined;
      console.log('Amount of data:');
      spawn('wc', ['-l', 'dataset.txt', 'cache/tweets.txt']).stdout.pipe(process.stdout);
      if (finished)
        process.exit(0);
    });
    last_run = new Date().getTime();
  });
};

setInterval(f, 1000);
f();
