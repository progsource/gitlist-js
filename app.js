var express = require('express');
var app = express();

app.get('/', function(req, res) {
    var body = 'Hello World';

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', Buffer.byteLength(body));

    res.end(body);
});

app.use(express.static(__dirname + '/app/public'));

app.listen(8080);
console.log('listen to port 8080');

