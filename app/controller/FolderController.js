/**
 * Folder Controller
 */
var FolderController = function() {
    var getBootstrap = function() {
        var Bootstrap = require(__dirname + '/../Bootstrap.js');
	return new Bootstrap().init();
    };

    var renderFolder = function(req, res, basePath, reponame, branch, dataPath) {
        var GitRepo = require(__dirname + '/../modules/GitRepo.js');
	var gitRepo = new GitRepo();

	var GitData = require(__dirname + '/../modules/GitData.js');
	var gitData = new GitData();

	gitRepo.setCurrentReponame(reponame);
	gitRepo.init();
	
	var branches = gitRepo.getBranches();

	if (null === branch) {
            branch = gitRepo.getCurrentBranch();
        } else {
	    gitRepo.setCurrentBranch(branch);
	}

	var renderIt = function(data) {
	    res.render(
                'folderView',
                {
		    title: reponame,
		    reponame: reponame,
		    heads: branches.heads,
		    tags: branches.tags,
		    branch: branch,
		    directoryContents: data.folder,
		    breadcrumb: data.breadcrumb,
		    activeTab: 'Files'
		}
	    );
	};

        gitData.getFolder(basePath + '/' + reponame, branch, dataPath, renderIt);
    };

    this.indexAction = function(req, res) {
	var fs = require('fs');
        var basePath = getBootstrap().getBasePath();
        var reponame = req.params.reponame;

	if (!fs.existsSync(basePath + '/' + reponame)) {
	    res.send(404, 'File/Dir not found');
	    return;
	}

	renderFolder(req, res, basePath, reponame, null, '.');
    };

    this.branchAction = function(req, res) {
        var basePath = getBootstrap().getBasePath();
	var reponame = req.params.reponame;
	var branch = req.params.branch;

        renderFolder(req, res, basePath, reponame, branch, '.');
    };

    this.treeAction = function(req, res) {
        var basePath = getBootstrap().getBasePath();
	var reponame = req.params.reponame;
	var branch = req.params.branch;
	var dataPath = req.params.dir;

        renderFolder(req, res, basePath, reponame, branch, dataPath);
    };
};

module.exports = FolderController;
