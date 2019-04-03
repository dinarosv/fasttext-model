import rp from 'request-promise';
import fs from 'fs';
import emojis from 'emoji-sentiment';
import cp from 'cli-progress';
import dotenv from 'dotenv';
import loadLexicon from './loadLexicon';

dotenv.config();

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

if (!args['-n'])
  throw new Error('Usage: must include -n flag');

if (!args['--cache'])
  args['--cache'] = '/cache/';
if (args['--cache'].charAt(0) !== '/')
  args['--cache'] = `/${args['--cache']}`;
if (args['--cache'].charAt(args['--cache'].length - 1) !== '/')
  args['--cache'] = `${args['--cache']}/`;

args['--cache'] = `/..${args['--cache']}`;

const es = {};
emojis.forEach(e => es[e.sequence.toLowerCase()] = e);
loadLexicon().then((lexicon) => {
  rp.post({
    uri: 'https://api.twitter.com/oauth2/token',
    method: 'POST',
    headers: {
      Authorization: `Basic ${process.env.TAPI_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    form: {
      grant_type: 'client_credentials',
    },
    transform: body => JSON.parse(body),
  }).then((token) => {
    fetchTweets('* -filter:retweets', 'no', args['-n'], token.access_token).then((data) => {
      const num = args['-n'];
      fs.appendFile(`${__dirname + args['--cache']}log.txt`, `${new Date().toString()} - ${JSON.stringify(process.argv.slice(2)).split('\n').join('').split(' ')
        .join('')}\n  Tweet interval: ${data.first_time} - ${data.last_time}\n  Tweets processed: ${num - data.count}\n  Tweets cached: ${data.data}\n  Tweet density: ${Math.floor(data.data * 10000 / (num - data.count)) / 100}%\n`, () => {});
      console.log(`Tweet interval: ${data.first_time} - ${data.last_time}\nTweets processed: ${num - data.count}\nTweets cached: ${data.data}\nTweet density: ${Math.floor(data.data * 10000 / (num - data.count)) / 100}%`);
    });
  });

  const fetchTweets = (q, lang, count, token) => new Promise((resolve, reject) => {
    let ret = 0;
    const startCount = count;
    const progress = new cp.Bar({
      barCompleteChar: '=',
      barIncompleteChar: ' ',
      fps: 10,
      stream: process.stdout,
      barsize: 40,
      position: 'center',
    });
    const stats = fs.existsSync(`${__dirname + args['--cache']}stats.json`) ? JSON.parse(fs.readFileSync(`${__dirname + args['--cache']}stats.json`)) : {};
    let since_id = '';
    let first_time = '';
    let last_time = '';
    let prog = 0;
    progress.start(count, 0);
    const cb = (data) => {
      const dlen = data.data.length;
      progress.increment(dlen);
      prog += dlen;
      if (args['--automation'])
        process.stdout.write(`Processing: ${prog}/${args['-n']} - ${(Math.floor((prog/Number(args['-n'])) * 10000) / 100).toFixed(2)}%`);
      count -= dlen;
      if (since_id === '')
        since_id = data.meta.since_id;
      if (first_time === '' && data.meta && data.meta.first_time)
        first_time = data.meta.first_time;
      if (data.meta && data.meta.last_time)
        last_time = data.meta.last_time;

      data.data = data.data.map((text) => {
        text = text.split(' ').filter(w => w.charAt(0) !== '@').map((w) => {
          if (w.indexOf('http') === -1 && w.indexOf('www') === -1)
            return w;
          if (w.indexOf('http') > -1)
            return w.slice(0, w.indexOf('http'));
          if (w.indexOf('www') > -1)
            return w.slice(0, w.indexOf('www'));
        }).join(' ');
        return text;
      }).filter((text) => {
        for (let i = 0; i < text.length; i++) {
          const point = text.codePointAt(i).toString(16);
          if (point.length < 4)
            continue;
          if (es[point])
            return true;
        }
        return text.split(' ').filter(word => !!lexicon[word]).length > 0;
      }).map(text => text.split('\n').join(''));
      ret += data.data.length;
      fs.appendFile(`${__dirname + args['--cache']}tweets.txt`, data.data.reduce((acc, val) => `${acc}${val}\n`, ''), () => {
        let max_id = '';
        if (data.meta.next_results)
          max_id = data.meta.next_results.split('?')[1].split('&').map(e => e.split('=')).filter(e => e[0] == 'max_id')[0][1];
        else if (data.meta.max_id)
          max_id = data.meta.max_id;
        fs.writeFile(`${__dirname + args['--cache']}stats.json`, JSON.stringify({
          since_id: args['--ignore-new'] ? (stats.since_id ? stats.since_id : since_id) : since_id,
          max_id: args['--ignore-new'] ? max_id : (stats.max_id ? stats.max_id : max_id),
        }), () => {
          if (count > 0 && dlen !== 0) {
            fetch(q, lang, count > 100 ? 100 : count, token, cb, args['--ignore-new'] ? undefined : stats.since_id, max_id);
          }
          else {
            progress.stop();
            resolve({
              data: ret, since_id, max_id, count, first_time, last_time,
            });
          }
        });
      });
    };
    fetch(q, lang, count > 100 ? 100 : count, token, cb, args['--ignore-new'] ? undefined : stats.since_id, args['--ignore-new'] ? stats.max_id : undefined);
  });
});

const fetch = (q, lang, count, token, cb, since_id, max_id) => {
  const opts = {
    method: 'GET',
    uri: 'https://api.twitter.com/1.1/search/tweets.json',
    qs: {
      q,
      lang,
      count,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    transform: body => JSON.parse(body),
  };
  if (max_id)
    opts.qs.max_id = max_id;
  if (since_id)
    opts.qs.since_id = since_id;
  rp.get(opts).then((data) => {
    cb({ data: data.statuses.map(status => status.text), meta: Object.assign(data.search_metadata, data.statuses.length > 0 ? { since_id: `${data.statuses[0].id}`, first_time: data.statuses[0].created_at, last_time: data.statuses[data.statuses.length - 1].created_at } : {}) });
  }).catch((err) => {
    console.log(err);
    cb({ data: [], meta: { max_id } });
  });
};
