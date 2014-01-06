var express = require('express');
var app = express();
var fs = require('fs');

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');


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

app.use(express.static(__dirname + '/app/public'));

app.listen(8080);
console.log('listen to port 8080');

