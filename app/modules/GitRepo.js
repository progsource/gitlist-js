/**
 * GitRepo class
 *
 * license MIT
 */

var fs = require('fs');

function GitRepo() {
    var basePath = '';
    var current = {
        reponame: '',
	branch: 'master'
    };
    var branches = [];

    this.setBasePath = function(path) {
        basePath = path;
    };

    this.setCurrentReponame = function(reponame) {
        current.reponame = reponame;
    };

    this.getCurrentReponame = function() {
        return current.reponame;
    };

    this.setCurrentBranch = function(branch) {
        current.branch = branch;
    };

    this.getCurrentBranch = function() {
        return current.branch;
    };

    this.getBranches = function() {
        if (0 == branches.length) {
	    branches.heads = fs.readdirSync(basePath + '/' + current.reponame + '/refs/heads');
	    branches.tags = fs.readdirSync(basePath + '/' + current.reponame + '/refs/tags');
	}

	return branches;
    };

    this.init = function() {
        if (0 == basePath.length) {
	    console.error('basePath has to be set before initialization');
	}
	if (0 == current.reponame.length) {
	    console.error('current reponame has to be set before initialization');
	}

        this.getBranches();

	if (-1 === branches.heads.indexOf(current.branch)) {
	    current.branch = branches.heads[0];
	}
    };

}

module.exports = GitRepo;
