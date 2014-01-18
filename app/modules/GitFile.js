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
	    .then(function(data) {
		var content = data;

		var breadcrumb = file.split('/');

		var breads = {};
		breadcrumb.forEach(function(bread, index) {
		    breads[bread] = '';
		    var i = 0;
		    if (breadcrumb.length - 1 != index) {
		        for (;i <= index; i++) {
			    breads[bread] += breadcrumb[i] + '%2F';
		        }
		    }
		});

		return {
		    content: content,
		    breadcrumb: breads
		};
	    })
	    .then(callback);
    };
};

module.exports = GitFile;
