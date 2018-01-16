
/**
 * Created by happy on 3/23/17.
 */

(function() {
    var CoffeeScript, Q, _, async, doQ, fs, fsReaddir, load, q_load;

    CoffeeScript = require('coffee-script');

    fs = require('fs');

    fsReaddir = require('fs-readdir');

    async = require('async');

    _ = require('lodash');

    Q = require('q');

    doQ = require('gqdoq');

    load = function(o, cb) {
        var coffees, path2;
        o = o || {};
        path2 = o.path || 'coffee';
        coffees = {};
        console.log('loading coffee scripts from path: ' + path2);
        fsReaddir(path2, function(e, files) {
            if (e) {
                console.log(e.stack);
                return cb(e);
            } else {
                async.each(files, (function(file, cb) {
                    var filename;
                    if (file.toLowerCase().indexOf('.coffee') !== -1) {
                        try {
                            filename = file.toLowerCase().replace(/\.coffee/g, '').replace(/\\/g, '\/');
                            console.log(filename);
                            coffees[filename] = CoffeeScript.compile(fs.readFileSync(file).toString()) || '';
                            return cb(null, o);
                        } catch (error) {
                            e = error;
                            console.log(e.stack);
                            return cb(e);
                        }
                    } else {
                        return cb(null);
                    }
                }), function(e) {
                    if (e) {
                        console.log(e.stack);
                    }
                    o.result = coffees;
                    global.coffee = global.coffee || {};
                    global.coffee = _.extend(global.coffee, o.result);
                    return cb(e, o);
                });
                return null;
            }
        });
        return null;
    };

    q_load = function(o) {
        o = o || {};
        o.query = load;
        return doQ(o);
    };

    exports.load = load;

    exports.requireFromString = require('require-from-string');

    exports.q_load = q_load;

}).call(this);
