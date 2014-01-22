/**
 * File Controller
 *
 * @file
 * @license MIT
 */

/**
 * @constructor
 */
var FileController = function() {
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
        var branch = req.params.branch;
        var file = req.params.file;

        var GitRepo = require(__dirname + '/../modules/GitRepo.js');
        var gitRepo = new GitRepo();

        var GitFile = require(__dirname + '/../modules/GitFile.js');
        var gitFile = new GitFile();

        gitRepo.setCurrentReponame(reponame);
        gitRepo.init();
    
        var branches = gitRepo.getBranches();

        gitRepo.setCurrentBranch(branch);

        var renderIt = function(data) {
            res.render(
                'fileView',
                {
                    title: reponame,
                    reponame: reponame,
                    heads: branches.heads,
                    tags: branches.tags,
                    branch: branch,
                    fileContent: data.content,
                    breadcrumb: data.breadcrumb,
                    activeTab: 'Files'
                }
            );
        };

        gitFile.getFile(basePath + '/' + reponame, branch, file, renderIt);
    };
};

module.exports = FileController;
