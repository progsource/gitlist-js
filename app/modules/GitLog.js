/**
 * GitLog
 */
var Promise = require('bluebird');

var GitLog = function() {
    this.getLog = function(path, branch, callback) {
	var prom = new Promise(function(resolve, reject) {
	    var spawn = require('child_process').spawn;
	    var gitLog = spawn('git', ['log', '--first-parent', branch], {cwd: path});
	    gitLog.stdout.on('data', resolve);
	    gitLog.stderr.on('data', reject);
	})
	    .then(function(data) {
		var commits = {};
		var history = data.toString('utf-8').split('\n');
		commits[history[0].substr(7)] = {
		    author: history[1].substr(8),
		    date: history[2].substr(8),
		    msg: history[4].substr(4)
		};
		console.log(commits);
		console.log(history.length);
		return commits;
            })
	    .then(function(data) {
		var breadcrumb = {'Commit history': ''};

		return {
		    commits: data,
		    breadcrumb: breadcrumb
		};
	    })
	    .then(callback);
    };
};

module.exports = GitLog;
