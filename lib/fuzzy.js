const Fuse = require('fuse.js');

const fuzzy = (query, rows, keys) => {
  const options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys
  };
  const fuse = new Fuse(rows, options);
  return fuse.search(query);
};

module.exports = fuzzy;