/**
 *
 */
var Promise = require('bluebird');
var run = Promise.promisify(require('child_process').spawn);

var GitData = function() {
    var breadcrumb = {};

    var gitTreeLineToObject = function(line, folderObject) {
	var key = line.split('\t')[1];
	if ('undefined' !== typeof key) {
	    var contents = line.split('\t')[0].split(' ');
	    var contentName = key.split('/');
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

    var gitTreeStringToObject = function(data) {
	var lines = data.toString().split('\n');
	var folder = {};
	lines.forEach(function(line) {
	    gitTreeLineToObject(line, folder)
	});

	var tree = {
	    breadcrumb: breadcrumb,
	    folder: folder
        };
	return tree;
    };

    this.getFolder = function(path, branch, deepPath, callback) {
	var spawn = require('child_process').spawn;
	var prom = new Promise(function(resolve, reject) {
	    var gitTree = spawn('git', ['ls-tree', branch, '-l', 'paths', deepPath], {cwd: path});
	    gitTree.stdout.on('data', resolve);
	    gitTree.stderr.on('data', reject);

	    breadcrumb = deepPath.split('/');
	    breadcrumb.splice(breadcrumb.length - 1, 1);
	})
	    .then(gitTreeStringToObject)
	    .then(callback);
    };
};

module.exports = GitData;
