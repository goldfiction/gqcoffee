
/**
 * Created by happy on 3/23/17.
 */

(function() {
    var CoffeeScript, _, async, doQ, fs, fsReaddir, load, q_load;

    CoffeeScript = require('coffee-script');

    fs = require('fs');

    fsReaddir = require('fs-readdir');

    async = require('async');

    doQ = require('gqdoq');

    _ = require('lodash');

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
                    filename = file.toLowerCase().replace('.coffee', '').replace(/\\/g, '\/');
                    console.log(filename);
                    if (file.indexOf('.coffee') !== -1) {
                        try {
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

    q_load = function(o) {
        o = o || {};
        o.query = load;
        return doQ(o).then(function() {
            global.coffee = global.coffee || {};
            return global.coffee = _.extend(global.coffee, o.result);
        });
    };

    exports.load = load;

    exports.requireFromString = require('require-from-string');

    exports.q_load = q_load;

}).call(this);
