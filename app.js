var express = require('express');
var app = express();
var fs = require('fs');
var gitrepo = require('./app/modules/GitRepo.js');
var GitRepo = new gitrepo();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

var gitRepoDir = 'C:/repo_git';

app.get('/', function(req, res) {
    var repositories = {};
    var dir = 'C:/repo_git';
    var folderInDir = fs.readdirSync(dir);
    
    folderInDir.forEach(function(currentDir) {
        var stats = fs.statSync(dir + '/' + currentDir);

	if (stats && stats.isDirectory()) {
            var descr = fs.readFileSync(dir + '/' + currentDir + '/description');
	    repositories[currentDir] = descr;
	}
    });

    res.render(
        'index',
	{
	    title: 'repository list',
	    repos: repositories
	}
    );
});

app.get('/:reponame', function(req, res) {
    var reponame = req.params.reponame;

    GitRepo.setBasePath(gitRepoDir);
    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    var branch = GitRepo.getCurrentBranch();

    res.render(
        'folderView',
	{
	    title: reponame,
	    reponame: reponame,
	    heads: branches.heads,
	    tags: branches.tags,
	    branch: branch
	}
    );
});

app.get('/:reponame/:branch', function(req, res) {
    var reponame = req.params.reponame;
    var branch = req.params.branch;

    GitRepo.setBasePath(gitRepoDir);
    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    GitRepo.setCurrentBranch(branch);
GitRepo.getDirectoryContents();
    res.render(
        'folderView',
	{
	    title: reponame,
	    reponame: reponame,
	    heads: branches.heads,
	    tags: branches.tags,
	    branch: branch
	}
    );
});

app.get('/:reponame/commits/:branch', function(req, res) {
    res.render(
        'index',
	{
	    title: 'blub',
	    repositories: []
	}
    );
});

app.use(express.static(__dirname + '/app/public'));

app.listen(8080);
console.log('listen to port 8080');

