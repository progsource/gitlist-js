/**
 * GitLog
 */
var GitLog = function() {
    var commits = {};

    var commitStringToObject = function(data) {
	var history = data.toString('utf-8').split('\n');
	history.forEach(function(logLine, index) {
	    if ('commit ' == logLine.substr(0, 'commit '.length)) {
                commits[logLine.substr(7)] = {
		    author: history[index + 1],
		    date: history[index + 2],
		    msg: history[index + 4]
		};
	    }
	});
    };

    this.getLog = function(path, branch, callback) {
	var spawn = require('child_process').spawn;
	var gitLog = spawn('git', ['log', '--first-parent', branch, '-n', 20], {cwd: path});
	gitLog.stdout.on('data', commitStringToObject);
	gitLog.on('close', function(code) {
	    callback({breadcrumb: {'Commit history': ''}, commits: commits});
	});
    };
};

module.exports = GitLog;
