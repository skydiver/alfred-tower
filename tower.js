const alfredo = require('alfredo');
const join = require('path').join;
const format = require('util').format;

const BOOKMARKS_FILE_V3 = join(
  process.env.HOME,
  'Library',
  'Application Support',
  'com.fournova.Tower3',
  'bookmarks-v2.plist'
);

const parseBookmarksSync = (f) => {
  let file = alfredo.readPlistSync(f);
  let sortOrder = 0;
  let bookmarks = [];

  const walk = (entry, parent) => {
    const PARENT = parent || {};

    if (entry.fileURL) {
      const folder = PARENT.name ? format('%s/', PARENT.name) : '';
      const name = format('%s%s', folder, entry.name);
      const path = decodeURIComponent(entry.fileURL.substr(7));

      if (entry.valid) {
        bookmarks.push({
          name: name,
          path: path,
          sortOrder: sortOrder
        });
      }

      sortOrder++;
    }

    (entry.children || []).forEach(function(child) {
      walk(child, entry, bookmarks);
    });
  };

  if (file.name) {
    delete file.name;
  }

  walk(file);

  return bookmarks;
};

const getResults = (arg) => {
  const bookmarks = parseBookmarksSync(BOOKMARKS_FILE_V3) || [];
  let results = [];

  if (!arg) {
    results = bookmarks.sort(function(a, b) {
      return a.sortOrder - b.sortOrder;
    });
  } else {
    return alfredo.fuzzy(arg, bookmarks.map(function(bookmark) {
      return bookmark.name;
    })).map(function(name) {
      return bookmarks.filter(function(bookmark) {
        return bookmark.name === name;
      }).pop();
    });
  }

  return results || [];
};

const getItems = (arg) => {
  return getResults(arg).map((bookmark) => {
    return new alfredo.Item({
      title: bookmark.name,
      subtitle: bookmark.path,
      arg: bookmark.path,
      icon: 'CloneRepoIcon.png'
    });
  });
};

module.exports = {
  getItems
};