/*!
 * tower-alfred-workflow
 * Copyright(c) 2015 Nicholas Penree <nick@penree.com>
 * MIT Licensed
 */

var alfredo = require('alfredo');
var join = require('path').join;
var format = require('util').format;
var exists = require('fs').existsSync;

var BOOKMARKS_FILE = join(
  process.env.HOME,
  'Library',
  'Application Support',
  'com.fournova.Tower2',
  'bookmarks.plist'
);

var BOOKMARKS_FILE_V2 = join(
  process.env.HOME,
  'Library',
  'Application Support',
  'com.fournova.Tower2',
  'bookmarks-v2.plist'
);

var parseBookmarksSync = exports.parseBookmarksSync = function(f) {
  var file = alfredo.readPlistSync(f);
  var sortOrder = 0;
  var bookmarks = [];

  var walk = function(entry, parent) {
    parent = parent || {};

    if (entry.fileURL && entry.fileReferenceURL) {
      var folder = parent.name ? format('%s/', parent.name) : '';
      var name = format('%s%s', folder, entry.name);
      var path = decodeURIComponent(entry.fileURL.substr(7));

      if (entry.valid) bookmarks.push({
        name: name,
        path: path,
        sortOrder: sortOrder
      });

      sortOrder++;
    }

    (entry.children || []).forEach(function(child) {
      walk(child, entry, bookmarks);
    });
  };

  if (file.name) delete file.name;

  walk(file);

  return bookmarks;
};

var getResults = exports.getResults = function(arg) {
  var file = exists(BOOKMARKS_FILE_V2) ? BOOKMARKS_FILE_V2 : BOOKMARKS_FILE;
  var bookmarks = parseBookmarksSync(file) || [];
  var results = [];

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

var getItems = exports.getItems = function(arg) {
  return getResults(arg).map(function(bookmark) {
    return new alfredo.Item({
      title: bookmark.name,
      subtitle: bookmark.path,
      arg: bookmark.path,
      icon: 'CloneRepoIcon.png'
    });
  });
};

if (!require.parent) {
  var args = process.argv;
  var items = getItems(args.length >= 3 ? args[2] : undefined);
  alfredo.feedback(items);
}
