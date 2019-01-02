const alfy = require('alfy');
const alfredNotifier = require('alfred-notifier');
const tower = require('./lib/tower');

alfredNotifier();

const repos = tower.getBookmarks();

const items = alfy
  .inputMatches(repos, 'name')
  .map(x => ({
    title: x.name,
    subtitle: x.path,
    icon: 'repo.png',
  }));

alfy.output(items);