/**
 * GitData
 *
 * @file
 * @license MIT
 */

/** @ignore */
var Promise = require('bluebird');

/**
 * @constructor
 */
var GitData = function() {
    /**
     * breadcrumb
     *
     * @type {object}
     */
    var breadcrumb = {};

    /**
     * git tree line to object
     *
     * @param {string} line - one line of 'git ls-tree' output
     * @param {object} folderObject - folder object
     *
     * @return {object} folder object
     */
    var gitTreeLineToObject = function(line, folderObject) {
        var key = line.split('\t')[1];

        if ('undefined' !== typeof key) {
            var contents = line.split('\t')[0].split(' '),
                contentName = key.split('/');
            contentName = contentName[contentName.length - 1];

            folderObject[key] = {
                mode: contents[0],
                contentType: contents[1],
                fileSize: contents[contents.length - 1],
                contentName: contentName
            };
        }

        return folderObject;
    };

    /**
     * git tree string to object
     *
     * @param {object} data - String Buffer
     *
     * @return {object} breadcrumb and folder
     */
    var gitTreeStringToObject = function(data) {
        var lines = data.toString().split('\n'),
            folder = {};

        lines.forEach(function(line) {
            gitTreeLineToObject(line, folder);
        });

        var tree = {
            breadcrumb: breadcrumb,
            folder: folder
        };
        return tree;
    };

    /**
     * get folder
     *
     * @param {string} path - base path + repository name
     * @param {string} branch - branch
     * @param {string} deepPath - path to look at
     * @param{function(data)} callback - callback that is called as soon as the folders are collected
     */
    this.getFolder = function(path, branch, deepPath, callback) {
        var spawn = require('child_process').spawn,
            prom = new Promise(function(resolve, reject) {
                var gitTree = spawn('git', ['ls-tree', branch, '-l', 'paths', deepPath], {cwd: path});
                gitTree.stdout.on('data', resolve);
                gitTree.stderr.on('data', reject);

                breadcrumb = deepPath.split('/');
                breadcrumb.splice(breadcrumb.length - 1, 1);
                var breads = {};
                breadcrumb.forEach(function(bread, index) {
                    breads[bread] = '';
                    if (breadcrumb.length - 1 != index) {
                        var i = 0;
                        for (;i <= index; i++) {
                            breads[bread] += breadcrumb[i] + '%2F';
                        }
                    }
                });
                breadcrumb = breads;
            })
            .then(gitTreeStringToObject)
            .then(callback)
            .error(function(e) {
                console.log(e.message);
            });
    };
};

module.exports = GitData;
