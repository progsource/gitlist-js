/**
 * Commits Controller
 */
var CommitsController = function() {
    var getBootstrap = function() {
        var Bootstrap = require(__dirname + '/../Bootstrap.js');
	return new Bootstrap().init();
    };

    var showCommits = function(req, res, basePath, reponame, branch, page) {
        var GitRepo = require(__dirname + '/../modules/GitRepo.js');
	var gitRepo = new GitRepo();
	
	var GitLog = require(__dirname + '/../modules/GitLog.js');
	var gitLog = new GitLog();

	gitRepo.setCurrentReponame(reponame);
	gitRepo.init();

	var branches = gitRepo.getBranches();

	gitRepo.setCurrentBranch(branch);

	var renderIt = function(data) {
	    res.render(
		'logView',
		{
		    title: reponame,
		    reponame: reponame,
		    heads: branches.heads,
		    tags: branches.tags,
		    branch: branch,
		    breadcrumb: data.breadcrumb,
		    commits: data.commits,
		    commitCount: data.commitCount,
		    page: page,
		    activeTab: 'Commits'
		}
	    );
	};

	gitLog.getLog(basePath + '/' + reponame, branch, page, renderIt);
    };

    this.indexAction = function(req, res) {
        var basePath = getBootstrap().getBasePath();
	var reponame = req.params.reponame;
	var branch = req.params.branch;

	if ('undefined' == typeof req.params.page) {
            var page = 0;
        } else {
	    var page = req.params.page;
	}

	showCommits(req, res, basePath, reponame, branch, page);
    };
};

module.exports = CommitsController;
