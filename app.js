var express = require('express');
var app = express();
var fs = require('fs');

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');


app.get('/', function(req, res) {
    var repositories = [];
    var dir = 'C:/repo_git';

    
console.log(repositories);
    res.render('index', { title: 'repository list'});
});

app.use(express.static(__dirname + '/app/public'));

app.listen(8080);
console.log('listen to port 8080');

