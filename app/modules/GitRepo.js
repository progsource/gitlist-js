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

    var initConfiguration = function() {
	var configFile = './app/configs/repos.json';
        try {
	    var config = JSON.parse(fs.readFileSync(configFile, {encode: 'utf-8'}));
	    if (!fs.existsSync(config.basePath)) {
		throw 'config base path does not exists';
		return;
            }
	    basePath = config.basePath;
	} catch(e) {
	    console.error('config file could not be read: ' + e);
	}
    };

    this.init = function() {
	initConfiguration();
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
    
    this.getDirectoryContents = function() {
var run = require('comandante');
	var revision = fs.readFileSync(basePath + '/' + current.reponame + '/refs/heads/' + current.branch, 'UTF-8');
	var Writable = require('stream').Writable;
	var ws = Writable({decodeString: false});
	var directoryContents = {};
	ws._write = function(data, enc, next) {
	    console.log(data.toString());
	};
	var directoryContentsStream = run('git', ['ls-tree', current.branch]).pipe(ws);

    };
}

module.exports = GitRepo;
