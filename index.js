/*jslint node:true */
"use strict";

var browserResolve = require('browser-resolve');

module.exports = function (jsDirs) {

    var resolver = {},
        namespacedPaths = {};

    /**
     * Set namespaced paths to be used by the resolver
     * @param {object[]} dirs 
     *        Objects containing info about the
     *        Directories you would like resolver
     *        to resolve. "name" Is the namespace,
     *        and "path" is the path to that directory
     */
    resolver.setNamespacedPaths = function (dirs) {
        var i = 0,
            len = dirs.length,
            name;
        for (i; i < len; i++) {
            name = dirs[i].name;
            name = (!name && !namespacedPaths.main) ? 'main' : name;
            namespacedPaths[name] = dirs[i].path;
        }
        return resolver;
    };

    /**
     * @public
     * Given a file path namespaced, returns
     * the file data from the register JS file
     * module. If no namespace is found, assumes
     * path is for default namespaced directory.
     *
     * Namespaced paths should start with the
     * namespace in curly braces (e.g.
     * '{vendor}/js/file1.js')
     *
     * @param  {string} filePath
     * @return {object}
     */
    resolver.findNamespacedJSFile = function (filePath) {
        var rootPath = resolver.findNamespacedJSDirPath(filePath);
        if (filePath.charAt(0) === '@') {
            filePath = filePath.substring(filePath.indexOf('/') + 1);
        } else if (filePath.charAt(0) === '/') {
            filePath = filePath.substring(1);
        }
        return rootPath + filePath;
    };

    /**
     * Given a path with a namespace, return the 
     * root path to that namespace
     * @param  {string} filePath
     * @return {string}
     */
    resolver.findNamespacedJSDirPath = function (filePath) {
        var getNamespace = /^@(\w+)\//,
            matches = filePath.match(getNamespace),
            rootPath;
        if (!matches) {
            matches = ['', 'main'];
        }
        if (!matches[1]) {
            throw new Error('Filepath "' + filePath + '" did not contain a valid namespace');
        }
        rootPath = namespacedPaths[matches[1]];

        if (!rootPath) {
            throw new Error('Namespace ' + matches[1] + ' did was not found in the js directory configuration.');
        }
        return rootPath;
    };

    /**
     * Resolve function, defers to 'browser-resolve',
     * if there isn't a namespace. Additionally, adds
     * the 'main' namespace path to the 'paths' option
     * for browser-resolver
     * @param  {string}   pkg  [description]
     * @param  {object}   opts [description]
     * @param  {function} cb   [description]
     */
    resolver.resolve = function (pkg, opts, cb) {
        var mainRootJSPath = namespacedPaths.main;
        if (pkg && (pkg.charAt(0) === '@')) {
            pkg = resolver.findNamespacedJSFile(pkg);
        } else if (mainRootJSPath) {
            opts.paths.push(mainRootJSPath);
        }
        return browserResolve(pkg, opts, cb);
    };

    if (jsDirs) {
        resolver.setNamespacedPaths(jsDirs);
    }

    return resolver;
};