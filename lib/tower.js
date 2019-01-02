const alfredo = require('alfredo');
const join = require('path').join;
const format = require('util').format;

const helpers = require('./helpers');

const BOOKMARKS_FILE_V3 = join(
  process.env.HOME,
  'Library',
  'Application Support',
  'com.fournova.Tower3',
  'bookmarks-v2.plist'
);

const walk = (entry, parent = null, bookmarks = [], sortOrder = 0) => {
  let SORT = sortOrder;
  const PARENT = parent || {};

  if (entry.fileURL) {
    const folder = PARENT.name ? format('%s/', PARENT.name) : '';
    const name = format('%s%s', folder, entry.name);
    const path = decodeURIComponent(entry.fileURL.substr(7));

    if (entry.valid) {
      bookmarks.push({
        name: name,
        path: path,
        sortOrder: SORT
      });
    }

    SORT++;
  }

  (entry.children || []).forEach((child) => {
    walk(child, entry, bookmarks);
  });

  return bookmarks;
};

/**
 * Parse Tower bookmarks file
 *
 * @param   {string} f  Tower3 bookmarks file
 * @returns {array}     Bookmarks list
 */
const parseBookmarksSync = (f) => {
  let file = helpers.readPlistSync(f);
  if (file.name) {
    delete file.name;
  }
  const bookmarks = walk(file);
  return bookmarks;
};

/**
 * Search Tower3 bookmarks file
 *
 * @param   {string} arg  Search string
 * @returns {array}       Search results
 */
const getResults = (arg) => {
  const bookmarks = parseBookmarksSync(BOOKMARKS_FILE_V3) || [];
  let results = [];

  if (!arg) {
    results = bookmarks.sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });
  } else {
    return alfredo.fuzzy(arg, bookmarks.map((bookmark) => {
      return bookmark.name;
    })).map((name) => {
      return bookmarks.filter((bookmark) => {
        return bookmark.name === name;
      }).pop();
    });
  }

  return results || [];
};

/**
 * Return found items in Alfred format
 *
 * @param   {string} arg  Search string
 * @returns {object}      Workflow items
 */
const getItems = (arg) => {
  return getResults(arg).map((bookmark) => {
    return new alfredo.Item({
      title: bookmark.name,
      subtitle: bookmark.path,
      arg: bookmark.path,
      icon: 'repo.png'
    });
  });
};


module.exports = {
  getItems
};