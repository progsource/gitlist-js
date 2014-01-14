/**
 *
 */
var Promise = require('bluebird');
var run = Promise.promisify(require('child_process').spawn);

var GitData = function() {
    var gitTreeLineToObject = function(line, folderObject) {
	var key = line.split('\t')[1];
	if ('undefined' !== typeof key) {
	    var contents = line.split('\t')[0].split(' ');
	    folderObject[key] = {
		mode: contents[0],
		contentType: contents[1],
		fileSize: contents[contents.length - 1]
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
	return folder;
    };

    this.getFolder = function(path, branch, callback) {
	var spawn = require('child_process').spawn;
	var prom = new Promise(function(resolve, reject) {
	    var gitTree = spawn('git', ['ls-tree', branch, '-l'], {cwd: path});
	    gitTree.stdout.on('data', resolve);
	    gitTree.stderr.on('data', reject);
	})
	    .then(gitTreeStringToObject)
	    .then(callback);
    };
};

module.exports = GitData;
