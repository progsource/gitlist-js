/**
 * Commit Controller
 *
 * @file
 * @license MIT
 */
var CommitController = function() {
    /**
     * get bootstrap
     *
     * @return {object} bootstrap
     */
    var getBootstrap = function() {
        var Bootstrap = require(__dirname + '/../Bootstrap.js');
        return new Bootstrap().init();
    };

    /**
     * index action
     *
     * @param {object} req - request object
     * @param {object} res - response object
     */
    this.indexAction = function(req, res) {
        var basePath = getBootstrap().getBasePath();
        var reponame = req.params.reponame;
        var treeish = req.params.treeish;

        var GitRepo = require(__dirname + '/../modules/GitRepo.js');
        var gitRepo = new GitRepo();

        var GitFile = require(__dirname + '/../modules/GitFile.js');
        var gitFile = new GitFile();

        gitRepo.setBasePath(basePath);
        gitRepo.setCurrentReponame(reponame);
        gitRepo.init();

        var branches = gitRepo.getBranches();
        var branch = gitRepo.getCurrentBranch();

        var renderIt = function(data) {
            res.render(
                'commitView',
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
