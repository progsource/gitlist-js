/**
 * Commits Controller
 *
 * @file
 * @license MIT
 */

/**
 * @constructor
 */
var CommitsController = function() {
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
     * show commits
     *
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {string} basePath - base path
     * @param {string} reponame - repository name
     * @param {string} branch - branch
     * @param {int} page - page number
     */
    var showCommits = function(req, res, basePath, reponame, branch, page) {
        var GitRepo = require(__dirname + '/../modules/GitRepo.js');
        var gitRepo = new GitRepo();

        var GitLog = require(__dirname + '/../modules/GitLog.js');
        var gitLog = new GitLog();

        gitRepo.setBasePath(basePath);
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

    /**
     * index action
     *
     * @param {object} req - request object
     * @param {object} res - response object
     */
    this.indexAction = function(req, res) {
        var basePath = getBootstrap().getBasePath(),
            reponame = req.params.reponame,
            branch = req.params.branch,
            page;

        if ('undefined' == typeof req.params.page) {
            page = 0;
        } else {
            page = req.params.page;
        }

        showCommits(req, res, basePath, reponame, branch, page);
    };
};

module.exports = CommitsController;
