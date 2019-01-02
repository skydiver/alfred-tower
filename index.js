const alfredo = require('alfredo');
const alfredNotifier = require('alfred-notifier');
const tower = require('./tower');

alfredNotifier();

const args = process.argv;
const items = tower.getItems(args.length >= 3 ? args[2] : null);
alfredo.feedback(items);