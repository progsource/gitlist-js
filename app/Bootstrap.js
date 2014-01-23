/**
 * Bootstrap
 *
 * @file
 * @license MIT
 */

/**
 * @constructor
 */
var Bootstrap = function() {
    /**
     * base path
     *
     * @type {string}
     */
    var basePath = '';

    /**
     * initialize configuration
     *
     * @param {string} pathToConfig - path to configuration file
     */
    var initConfiguration = function(pathToConfig) {
        try {
            var fs = require('fs');
            var config = JSON.parse(fs.readFileSync(pathToConfig, {encode: 'utf-8'}));
            if (!fs.existsSync(config.basePath)) {
                throw 'config base path does not exist';
                return;
            }

            basePath = config.basePath;
        } catch(e) {
            console.error('config file could not be read: ' + e);
        }
    }; 

    /**
     * initialize bootstrap
     *
     * @return {object} this
     */
    this.init = function() {
        initConfiguration(__dirname + '/configs/repos.json');
        return this;
    };

    /**
     * get base path
     *
     * @return {string} basePath - base path
     */
    this.getBasePath = function() {
        return basePath;
    };
};

module.exports = Bootstrap;
