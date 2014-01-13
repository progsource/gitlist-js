/**
 *
 */
var Promise = require('bluebird');
var run = require('comandante');
Promise.promisifyAll(run);
var GitData = function() {
    this.getFolder = function(path, branch) {
        runAsync('GIT_DIR=' + path, ['git', 'ls-tree', branch, '-l']).then(console.log);
    };
};

module.exports = GitData;
