const alfy = require('alfy');
const alfredNotifier = require('alfred-notifier');
const tower = require('./lib/tower');
const fuzzy = require('./lib/fuzzy');

alfredNotifier();

let repos = tower.getBookmarks();
const query = process.argv[2];

if (query.trim() !== '') {
  repos = fuzzy(query, repos, ['name']);
}

const items = repos.map(x => ({
  title: x.name,
  subtitle: x.path,
  arg: x.path,
  icon: {
    path: './repo.png'
  }
}));

alfy.output(items);