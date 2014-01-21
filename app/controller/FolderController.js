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

	if ('undefined' == typeof branch) {
            var branch = gitRepo.getCurrentBranch();
        }

	var renderIt = function(data) {
	    res.render(
                'folderView',
                {
		    title: reponame,
		    reponame: reponame,
		    heads: branches.heads,
		    tags: branches.tags,
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

	renderFolder(req, res, basePath, reponame, undefined, '.');
    };
};

module.exports = FolderController;
