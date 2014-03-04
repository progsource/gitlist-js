/**
 * Router handling
 *
 * @file
 * @license MIT
 */
var express = require('express');
var app = express();

var port = 8070;

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

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
    var CommitController = require('./app/controller/CommitController.js');
    var commitController = new CommitController();
    commitController.indexAction(req, res);
});

app.listen(port);
console.log('listen to port ' + port);

