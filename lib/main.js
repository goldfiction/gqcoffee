
/**
 * Created by happy on 3/23/17.
 */

(function() {
    var CoffeeScript, Q, _, async, doQ, fs, fsReaddir, load, q_load, q_load1, q_load2;

    CoffeeScript = require('coffee-script');

    fs = require('fs');

    fsReaddir = require('fs-readdir');

    async = require('async');

    _ = require('lodash');

    Q = require('q');

    doQ = require('gqdoq');

    load = function(o, cb) {
        var coffees, path2;
        path2 = o.path || 'coffee';
        coffees = {};
        console.log('loading coffee scripts from path: ' + path2);
        return fsReaddir(path2, function(e, files) {
            if (e) {
                console.log(e.stack);
                return cb(e);
            } else {
                return async.each(files, (function(file, cb) {
                    var filename, pathnew;
                    pathnew = file;
                    if (file.indexOf('.coffee') !== -1) {
                        try {
                            filename = file.toLowerCase().replace(/\.coffee/g, '').replace(/\\/g, '\/');
                            console.log(filename);
                            coffees[filename] = CoffeeScript.compile(fs.readFileSync(pathnew).toString()) || '';
                            return cb();
                        } catch (error) {
                            e = error;
                            console.log(e.stack);
                            return cb(e);
                        }
                    }
                }), function(e) {
                    if (e) {
                        console.log(e.stack);
                    }
                    o.result = coffees;
                    return cb(e, o);
                });
            }
        });
    };

    q_load1 = function(o) {
        o = o || {};
        o.query = load;
        return doQ(o);
    };

    q_load2 = function(o) {
        o = o || {};
        o.query = function(o, cb) {
            global.coffee = global.coffee || {};
            global.coffee = _.extend(global.coffee, o.result);
            return cb();
        };
        return doQ(o);
    };

    q_load = function() {
        return q_load1().then(q_load2);
    };

    exports.load = load;

    exports.requireFromString = require('require-from-string');

    exports.q_load = q_load;

}).call(this);
