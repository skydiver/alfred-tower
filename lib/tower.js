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

const walk = (entry, parent = null, bookmarks = []) => {
  const PARENT = parent || {};

  if (entry.fileURL) {
    const folder = PARENT.name ? format('%s/', PARENT.name) : '';
    const name = format('%s%s', folder, entry.name);
    const path = decodeURIComponent(entry.fileURL.substr(7));
    if (entry.valid) {
      bookmarks.push({
        name: name,
        path: path,
      });
    }
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
const getBookmarks = () => {
  let file = helpers.readPlistSync(BOOKMARKS_FILE_V3);
  if (file.name) {
    delete file.name;
  }
  const bookmarks = walk(file);
  return bookmarks;
};

module.exports = {
  getBookmarks
};