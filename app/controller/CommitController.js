/**
 * Commit Controller
 */
var CommitController = function() {
    var getBootstrap = function() {
        var Bootstrap = require(__dirname + '/../Bootstrap.js');
	return new Bootstrap().init();
    };

    this.indexAction = function(req, res) {
        var basePath = getBootstrap().getBasePath();
        var reponame = req.params.reponame;
	var treeish = req.params.treeish;

	var GitRepo = require(__dirname + '/../modules/GitRepo.js');
	var gitRepo = new GitRepo();

        var GitFile = require(__dirname + '/../modules/GitFile.js');
	var gitFile = new GitFile();

	gitRepo.setCurrentReponame(reponame);
	gitRepo.init();

	var branches = gitRepo.getBranches();
	var branch = gitRepo.getCurrentBranch();

	var renderIt = function(data) {
	    res.render(
		'fileView',
		{
		    title: reponame,
		    reponame: reponame,
		    heads: branches.heads,
		    tags: branches.tags,
		    branch: branch,
		    breadcrumb: data.breadcrumb,
		    fileContent: data.content,
		    activeTab: 'Commits'
		}
	    );
	};

	gitFile.getDiff(basePath + '/' + reponame, treeish, renderIt);
    };
};

module.exports = CommitController;
