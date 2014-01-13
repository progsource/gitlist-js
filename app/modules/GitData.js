/**
 *
 */
var Promise = require('bluebird');
var run = Promise.promisify(require('child_process').spawn);

var GitData = function() {

    this.test = function(path, branch, callback) {
	var spawn = require('child_process').spawn;
	var prom = new Promise(function(resolve, reject) {
	    var gitTree = spawn('git', ['ls-tree', branch, '-l'], {cwd: path});
	    gitTree.stdout.on('data', resolve);
	    gitTree.stderr.on('data', reject);
	}).then(function(data) {
	    var lines = data.toString().split('\n');
	    var folder = {};
	    lines.forEach(function(line) {
		var key = line.split('\t')[1];
		if ('undefined' !== typeof key) {
		    var contents = line.split('\t')[0].split(' ');
		    folder[key] = {
			contentType: contents[1],
		        fileSize: contents[contents.length - 1]
		    };
		}
	    });
	    return folder;
	}).then(callback);
    };

    this.getFolder = function(path, branch) {
        run('git', ['ls-tree', branch], {cwd: path})
            .then(function(data) {
		console.log('in then');
		console.log('' + data);
	    })
	    .catch(function(e) {
                console.log(e);
            });
    };
};

module.exports = GitData;
