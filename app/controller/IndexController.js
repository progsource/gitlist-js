/**
 * Index Controller
 *
 * @file
 * @license MIT
 */

/**
 * @constructor
 */
var IndexController = function() {
    /**
     * get bootstrap
     *
     * @return {object} bootstrap
     */
    var getBootstrap = function() {
        var Bootstrap = require('./../Bootstrap.js');
        return new Bootstrap().init();
    };

    /**
     * index action
     *
     * @param {object} req - request object
     * @param {object} res - response object
     */
    this.indexAction = function(req, res) {
        var fs = require('fs'),
            repositories = {},
            basePath = getBootstrap().getBasePath(),
            folder = fs.readdirSync(basePath);

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
