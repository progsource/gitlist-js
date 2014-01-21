var express = require('express');
var app = express();
var fs = require('fs');
var gitrepo = require('./app/modules/GitRepo.js');
var GitRepo = new gitrepo();
var GitData = require('./app/modules/GitData.js');
var gitdata = new GitData();
var Promise = require('bluebird');

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

var gitRepoDir = '';

function init() {
    var configFile = './app/configs/repos.json';
    try {
	var config = JSON.parse(fs.readFileSync(configFile, {encode: 'utf-8'}));
	if (!fs.existsSync(config.basePath)) {
            throw 'config base path does not exists';
	    return;
	}
	gitRepoDir = config.basePath;
    } catch (e) {
	 console.error('config file could not be read: ' + e);
    }
}

app.get('/', function(req, res) {
    var IndexController = require('./app/controller/IndexController.js');
    var indexController = new IndexController();
    indexController.indexAction(req, res);
});

app.use(express.static(__dirname + '/app/public'));

app.get('/:reponame', function(req, res) {
    var FolderController = require('./app/controller/FolderController.js');
    var folderController = new FolderController();
    folderController.indexAction(req, res);
});

app.get('/:reponame/:branch', function(req, res) {
    var FolderController = require('./app/controller/FolderController.js');
    var folderController = new FolderController();
    folderController.branchAction(req, res);
});

app.get('/:reponame/tree/:branch/:dir', function(req, res) {
    var FolderController = require('./app/controller/FolderController.js');
    var folderController = new FolderController();
    folderController.treeAction(req, res);
});

app.get('/:reponame/blob/:branch/:file', function(req, res) {
    var FileController = require('./app/controller/FileController.js');
    var fileController = new FileController();
    fileController.indexAction(req, res);
});

app.get('/:reponame/commits/:branch', function(req, res) {
    var CommitsController = require('./app/controller/CommitsController.js');
    var commitsController = new CommitsController();
    commitsController.indexAction(req, res);
});

app.get('/:reponame/commits/:branch/:page', function(req, res) {
    var CommitsController = require('./app/controller/CommitsController.js');
    var commitsController = new CommitsController();
    commitsController.indexAction(req, res);
});

app.get('/:reponame/commit/:treeish', function(req, res) {
    init();
    var reponame = req.params.reponame;
    var treeish = req.params.treeish;

    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    var branch = GitRepo.getCurrentBranch();

    var GitFile = require('./app/modules/GitFile.js');
    var gitFile = new GitFile();

    var renderIt = function(data) {
        res.render(
	    'fileView',
	    {
		title: reponame,
		reponame: reponame,
		heads: branches.heads,
		tags: branches.tags,
		breadcrumb: data.breadcrumb,
		activeTab: 'Commits',
		fileContent: data.content,
		branch: branch
            }
	);
    };

    gitFile.getDiff(gitRepoDir + '/' + reponame, treeish, renderIt);
});

app.listen(8080);
console.log('listen to port 8080');

