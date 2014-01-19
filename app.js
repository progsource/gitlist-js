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
    init();

    var repositories = {};
    var dir = gitRepoDir;
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
app.use(express.static(__dirname + '/app/public'));

app.get('/:reponame', function(req, res) {
    init();

    var reponame = req.params.reponame;

    if (!fs.existsSync(gitRepoDir + '/' + reponame)) {
	res.send(404, 'File/Dir not found');
	return;
    }

    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    var branch = GitRepo.getCurrentBranch();
    
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
    gitdata.getFolder(gitRepoDir + '/' + reponame, branch, '.', renderIt);
});

app.get('/:reponame/:branch', function(req, res) {
    init();
    var reponame = req.params.reponame;
    var branch = req.params.branch;

    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    GitRepo.setCurrentBranch(branch);
    
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
    gitdata.getFolder(gitRepoDir + '/' + reponame, branch, '.', renderIt);
});

app.get('/:reponame/tree/:branch/:dir', function(req, res) {
    init();

    var reponame = req.params.reponame;
    var branch = req.params.branch;
    var dir = unescape(req.params.dir);

    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    GitRepo.setCurrentBranch(branch);

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
    gitdata.getFolder(gitRepoDir + '/' + reponame, branch, dir, renderIt);
});

app.get('/:reponame/blob/:branch/:file', function(req, res) {
    init();

    var reponame = req.params.reponame;
    var branch = req.params.branch;
    var file = unescape(req.params.file);

    var GitFile = require('./app/modules/GitFile.js');
    var gitFile = new GitFile();

    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    GitRepo.setCurrentBranch(branch);

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

    gitFile.getFile(gitRepoDir + '/' + reponame, branch, file, renderIt);
});

function showCommits(req, res, page) {
    init();
    
    var reponame = req.params.reponame;
    var branch = req.params.branch;

    var GitLog = require('./app/modules/GitLog.js');
    var gitLog = new GitLog();

    GitRepo.setCurrentReponame(reponame);
    GitRepo.init();
    var branches = GitRepo.getBranches();
    GitRepo.setCurrentBranch(branch);

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
		activeTab: 'Commits',
		commitCount: data.commitCount,
		page: page
	    }
        );
    };

    gitLog.getLog(gitRepoDir + '/' + reponame, branch, page, renderIt);
}

app.get('/:reponame/commits/:branch', function(req, res) {
    showCommits(req, res, 0);
});

app.get('/:reponame/commits/:branch/:page', function(req, res) {
    var page = req.params.page;
    showCommits(req, res, page);
});

app.listen(8080);
console.log('listen to port 8080');

