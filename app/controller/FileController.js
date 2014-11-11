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
     * get file ending of a filename
     *
     * @param {string} filename
     *
     * @return {string} file ending
     */
    var getFileEnding = function(filename) {
        var fileMap = filename.split('/');
        var positionOfLastDot = fileMap[fileMap.length - 1].lastIndexOf('.');
        return fileMap[fileMap.length - 1].substr(positionOfLastDot + 1);
    };

    /**
     * get file mode for filename
     *
     * @param {string} filename
     *
     * @return {string} file mode for codemirror
     */
    var getMode = function(filename) {
        var fileEnding = getFileEnding(filename);

        switch (fileEnding) {
            case 'css':
            case 'less':
                return 'css';
            case 'c':
            case 'cpp':
            case 'h':
            case 'hpp':
                return 'clike';
            case 'html':
                return 'htmlmixed';
            case 'jade':
                return 'jade';
            case 'js':
            case 'json':
            case 'bowerrc':
                return 'javascript';
            case 'lua':
                return 'lua';
            case 'md':
                return 'markdown';
            case 'php':
                return 'php';
            case 'py':
                return 'python';
            case 'sh':
                return 'shell';
            case 'sql':
                return 'sql';
            case 'tex':
                return 'stex';
            case 'mm':
            case 'sla':
            case 'xml':
                return 'xml';
            case 'yml':
                return 'yaml';
            case 'gif':
            case 'jpg':
            case 'jpeg':
            case 'png':
                return 'image';
            default:
                return 'null';
        }
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
        var fileMode = getMode(file);

        var GitRepo = require(__dirname + '/../modules/GitRepo.js');
        var gitRepo = new GitRepo();

        var GitFile = require(__dirname + '/../modules/GitFile.js');
        var gitFile = new GitFile();

        gitRepo.setCurrentReponame(reponame);
        gitRepo.setBasePath(basePath);
        gitRepo.init();
    
        var branches = gitRepo.getBranches();

        gitRepo.setCurrentBranch(branch);

        var renderIt = function(data) {
            if ('image' == fileMode) {
                data.content = file;
            }

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
                    activeTab: 'Files',
                    codemode: fileMode
                }
            );
        };

        gitFile.getFile(basePath + '/' + reponame, branch, file, renderIt);
    };
};

module.exports = FileController;
