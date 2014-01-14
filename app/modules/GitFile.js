/**
 * GitFile
 */
var Promise = require('bluebird');

var GitFile = function() {
    this.getFile = function(path, branch, file, callback) {
	var prom = new Promise(function(resolve, reject) {
            var spawn = require('child_process').spawn;
	    var gitFile = spawn('git', ['cat-file', '-p', branch + ':' + file], {cwd: path});
            gitFile.stdout.on('data', resolve);
	    gitFile.stderr.on('data', reject);
	})
	    .then(callback);
    };
};

module.exports = GitFile;
