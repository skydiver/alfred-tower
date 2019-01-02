const fs = require('fs');
const path = require('path');
const plist = require('plist');

const readPlistSync = (file) => {
  return plist.parse(fs.readFileSync(path.resolve(file), 'utf8'));
};

module.exports = {
  readPlistSync
};