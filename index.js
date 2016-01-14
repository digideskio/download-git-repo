var Download = require('download');

/**
 * Expose `download`.
 */

module.exports = download;

/**
 * Download `repo` to `dest` and callback `fn(err)`.
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Function} fn
 */

function download(repo, dest, fn) {
  var url;
  if (repo.indexOf('github:') === 0)
    url = github(normalize(repo.substring(7)));
  else if (repo.indexOf('bitbucket:') === 0)
    url = bitbucket(normalize(repo.substring(10)));
  else
    url = github(normalize(repo));

  var dl = new Download({ mode: '666', extract: true, strip: 1 }).get(url).dest(dest).run(function(err, files) {
    err === null ? fn() : fn(err)
  });
}

/**
 * Return a GitHub url for a given `repo` object.
 *
 * @param {Object} repo
 * @return {String}
 */

function github(repo) {
  return 'https://github.com/'
    + repo.owner
    + '/'
    + repo.name
    + '/archive/'
    + repo.branch
    + '.zip';
}

/**
 * Return a Bitbucket url for a given `repo` object.
 *
 * @param {Object} repo
 * @return {String}
 */

function bitbucket(repo) {
  return 'https://bitbucket.org/'
    + repo.owner
    + '/'
    + repo.name
    + '/get/'
    + repo.branch
    + '.zip';
}

/**
 * Normalize a repo string.
 *
 * @param {String} string
 * @return {Object}
 */

function normalize(string) {
  var owner = string.split('/')[0];
  var name = string.split('/')[1];
  var branch = 'master';

  if (~name.indexOf('#')) {
    branch = name.split('#')[1];
    name = name.split('#')[0];
  }

  return {
    owner: owner,
    name: name,
    branch: branch
  };
}