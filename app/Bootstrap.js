/**
 * Bootstrap
 */
var Bootstrap = function() {
    var basePath = '';

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

    this.init = function() {
	initConfiguration(__dirname + '/configs/repos.json');

	return this;
    };

    this.getBasePath = function() {
        return basePath;
    };
};

module.exports = Bootstrap;
