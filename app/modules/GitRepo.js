/**
 * GitRepo class
 *
 * @file
 * @license MIT
 */

/** @ignore */
var fs = require('fs');

/**
 * @constructor
 */
function GitRepo() {
    /**
     * base path
     *
     * @type {string}
     */
    var basePath = '';

    /**
     * current object
     *
     * @type {object}
     */
    var current = {
        reponame: '', // repository name
        branch: 'master' // branch name
    };

    /**
     * branches
     *
     * @type {array}
     */
    var branches = [];

    /**
     * set base path
     *
     * @param {string} path - base path
     */
    this.setBasePath = function(path) {
        basePath = path;
    };

    /**
     * set current repository name
     *
     * @param {string} reponame - repository name
     */
    this.setCurrentReponame = function(reponame) {
        current.reponame = reponame;
    };

    /**
     * get current repoitory name
     *
     * @return {string} current repository name
     */
    this.getCurrentReponame = function() {
        return current.reponame;
    };

    /**
     * set current branch
     *
     * @param {string} branch - branch
     */
    this.setCurrentBranch = function(branch) {
        current.branch = branch;
    };

    /**
     * get current branch
     *
     * @return {string} current branch
     */
    this.getCurrentBranch = function() {
        return current.branch;
    };

    /**
     * get branches from current repository
     *
     * @return {object} heads and tags
     */
    this.getBranches = function() {
        if (0 === branches.length) {
            branches.heads = fs.readdirSync(basePath + '/' + current.reponame + '/refs/heads');
            branches.tags = fs.readdirSync(basePath + '/' + current.reponame + '/refs/tags');
        }

        return branches;
    };

    /**
     * initialize configuration
     *
     * @todo remove duplicated code - @see app/Bootstrap.js
     */
    var initConfiguration = function() {
        var configFile = './app/configs/repos.json';
        try {
            var config = JSON.parse(fs.readFileSync(configFile, {encode: 'utf-8'}));
            if (!fs.existsSync(config.basePath)) {
                throw 'config base path does not exists';
                return;
            }
            basePath = config.basePath;
        } catch(e) {
            console.error('config file could not be read: ' + e);
        }
    };

    /**
     * initialize GitRepo
     */
    this.init = function() {
        initConfiguration();
        if (0 === basePath.length) {
            console.error('basePath has to be set before initialization');
        }
        if (0 === current.reponame.length) {
            console.error('current reponame has to be set before initialization');
        }

        this.getBranches();

        if (-1 === branches.heads.indexOf(current.branch)) {
            current.branch = branches.heads[0];
        }
    };

    /** @ignore */
    this.getDirectoryContents = function() {
        var revision = fs.readFileSync(basePath + '/' + current.reponame + '/refs/heads/' + current.branch, 'UTF-8');
    };
}

module.exports = GitRepo;
