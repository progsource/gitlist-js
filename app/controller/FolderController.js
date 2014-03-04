/**
 * Folder Controller
 *
 * @file
 * @license MIT
 */

/**
 * @constructor
 */
var FolderController = function() {
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
     * render folder
     *
     * @param {object} req - request object
     * @param {object} res - response object
     * @param {string} basePath - base path
     * @param {string} reponame - repository name
     * @param {string} branch - branch
     * @param {string} dataPath - the deep path too look at
     */
    var renderFolder = function(req, res, basePath, reponame, branch, dataPath) {
        var GitRepo = require(__dirname + '/../modules/GitRepo.js');
        var gitRepo = new GitRepo();

        var GitData = require(__dirname + '/../modules/GitData.js');
        var gitData = new GitData();

        gitRepo.setBasePath(basePath);
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

    /**
     * index action
     *
     * @param {object} req - request object
     * @param {object} res - response object
     */
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

    /**
     * branch action
     *
     * @param {object} req - request object
     * @param {object} res - response object
     */
    this.branchAction = function(req, res) {
        var basePath = getBootstrap().getBasePath();
        var reponame = req.params.reponame;
        var branch = req.params.branch;

        renderFolder(req, res, basePath, reponame, branch, '.');
    };

    /**
     * tree action
     *
     * @param {object} req - request object
     * @param {object} res - response object
     */
    this.treeAction = function(req, res) {
        var basePath = getBootstrap().getBasePath();
        var reponame = req.params.reponame;
        var branch = req.params.branch;
        var dataPath = req.params.dir;

        renderFolder(req, res, basePath, reponame, branch, dataPath);
    };
};

module.exports = FolderController;
