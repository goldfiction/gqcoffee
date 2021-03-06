(function() {
  /**
   * Created by happy on 3/23/17.
   */
  var CoffeeScript, Q, UglifyJS, _, async, debug, doQ, fs, fsReaddir, load, loadFromString, loadFromStringSync, q_load, q_loadFromString;

  CoffeeScript = require('coffee-script');

  fs = require('fs');

  fsReaddir = require('fs-readdir');

  async = require('async');

  _ = require('lodash');

  Q = require('q');

  doQ = require('gqdoq');

  UglifyJS = require('uglify-js');

  debug = require("debug")("http");

  global.coffee = global.coffee || {};

  exports.requireFromString = require('require-from-string');

  load = function(o, cb) {
    var coffees, path2;
    o = o || {};
    o.option = o.option || {};
    path2 = o.path || 'coffee';
    coffees = {};
    debug('loading coffee scripts from path: ' + path2);
    fsReaddir(path2, function(e, files) {
      if (e) {
        debug(e.stack);
        return cb(e);
      } else {
        async.each(files, (function(file, cb) {
          var filename;
          if (file.toLowerCase().indexOf('.coffee') !== -1) {
            try {
              filename = file.toLowerCase().replace(/\.coffee/g, '').replace(/\\/g, '\/');
              debug(filename);
              coffees[filename] = CoffeeScript.compile(fs.readFileSync(file).toString(), o.option) || '';
              if (!o.option.nominify) { // minify code by default. To turn this off, set option.nominify to true
                coffees[filename] = UglifyJS.minify(coffees[filename], {
                  fromString: true
                }).code;
              }
              return cb(null, o);
            } catch (error) {
              e = error;
              debug(e.stack);
              return cb(e);
            }
          } else {
            return cb(null);
          }
        }), function(e) {
          if (e) {
            debug(e.stack);
          }
          o.result = coffees;
          this.coffee = _.extend(this.coffee, o.result);
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

  loadFromString = function(o, cb) {
    var e, res;
    o.script = o.script || "";
    o.option = o.option || {};
    try {
      res = CoffeeScript.compile(o.script, o.option) || '';
      if (!o.option.nominify) { // minify code by default. To turn this off, set option.nominify to true
        res = UglifyJS.minify(res);
      }
      o.result = res;
      return cb(null, o);
    } catch (error) {
      e = error;
      debug(e.stack);
      o.error = e;
      return cb(e);
    }
  };

  loadFromStringSync = function(o) {
    var e, res;
    o.script = o.script || "";
    o.option = o.option || {};
    try {
      res = CoffeeScript.compile(o.script, o.option) || '';
      if (!o.option.nominify) { // minify code by default. To turn this off, set option.nominify to true
        res = UglifyJS.minify(res);
      }
      o.result = res;
      return o;
    } catch (error) {
      e = error;
      debug(e.stack);
      o.error = e;
      return o;
    }
  };

  q_loadFromString = function(o) {
    o = o || {};
    o.query = loadFromString;
    return doQ(o);
  };

  exports.load = load;

  exports.q_load = q_load;

  exports.loadFromString = loadFromString;

  exports.q_loadFromString = q_loadFromString;

  exports.loadFromStringSync = loadFromStringSync;

}).call(this);
