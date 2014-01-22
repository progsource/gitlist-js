/**
 * Index Controller
 */
var IndexController = function() {
    var getBootstrap = function() {
    var Bootstrap = require('./../Bootstrap.js');
    return new Bootstrap().init();
    };

    this.indexAction = function(req, res) {
    var fs = require('fs');
    var repositories = {};
    var basePath = getBootstrap().getBasePath();
    var folder = fs.readdirSync(basePath);

    folder.forEach(function(currentDir) {
        var stats = fs.statSync(basePath + '/' + currentDir);

        if (stats && stats.isDirectory()) {
        var description = fs.readFileSync(basePath + '/' + currentDir + '/description');
        repositories[currentDir] = description;
        }
    });
    
    
        res.render(
            'index',
            {
                title: 'repository list',
                repos: repositories
            }
        );
    };
};

module.exports = IndexController;
