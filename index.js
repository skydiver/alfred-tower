const alfredo = require('alfredo');
const tower = require('./tower');

const args = process.argv;
const items = tower.getItems(args.length >= 3 ? args[2] : null);
alfredo.feedback(items);