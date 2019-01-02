/*
 * tower-alfred-workflow
 * Copyright(c) 2015 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

const alfredo = require('alfredo');
const exists = require('fs').existsSync;
const tower = require('./tower');







const args = process.argv;
const items = tower.getItems(args.length >= 3 ? args[2] : null);
alfredo.feedback(items);