/**
 * GitFile
 *
 * @file
 * @license MIT
 */

/** @ignore */
var Promise = require('bluebird');

/**
 * @constructor
 */
var GitFile = function() {
    /**
     * get breadcrumb
     *
     * @param {string} path - path to get breadcrumb from
     *
     * @return {object} breadcrumb
     */
    var getBreadcrumb = function(path) {
        var breadcrumb = path.split('/'),
            breads = {};

        breadcrumb.forEach(function(bread, index) {
            breads[bread] = '';
            var i = 0;

            if (breadcrumb.length - 1 != index) {
                for (;i <= index; i++) {
                    breads[bread] += breadcrumb[i] + '%2F';
                }
            }
        });

        return breads;
    };

    /**
     * get file
     *
     * @param {string} path - base path + repository name
     * @param {string} branch - branch
     * @param {string} file - filename
     * @param {function(data)} callback - function that will be called after all data is collected
     */
    this.getFile = function(path, branch, file, callback) {
        var prom = new Promise(function(resolve, reject) {
            var spawn = require('child_process').spawn,
                gitFile = spawn('git', ['cat-file', '-p', branch + ':' + file], {cwd: path});

            gitFile.stdout.on('data', resolve);
            gitFile.stderr.on('data', reject);
        })
        .then(function(data) {
            var content = data;
            breads = getBreadcrumb(file);

            return {
                content: content,
                breadcrumb: breads
            };
        })
        .then(callback);
    };

    /**
     * get diff
     *
     * @param {string} path - base path + repository name
     * @param {string} treeish - treeish of the diff
     * @param {functio(data)} callback - function that will be called after all data is collected
     */
    this.getDiff = function(path, treeish, callback) {
        var breadcrumb = {};
        breadcrumb['Commit ' + treeish] = '';

        var prom = new Promise(function(resolve, reject) {
            var spawn = require('child_process').spawn,
                gitDiff = spawn('git', ['log', '-p', treeish], {cwd: path});

            gitDiff.stdout.on('data', resolve);
            gitDiff.stderr.on('data', reject);
        })
        .then(function(data) {
            return {
                content: data.toString(),
                breadcrumb: breadcrumb
            };
        })
        .then(callback)
        .error(function(e) {
            console.error(e.toString());
        });
    };
};

module.exports = GitFile;
