
/**
 * Created by happy on 3/23/17.
 */

(function() {
  var assert, gqcoffee, o;

  assert = require('assert');

  gqcoffee = require('../lib/main.js');

  o = {};

  describe('default', function() {
    it('should be able to load coffees', function(done) {
      gqcoffee.load(o, function(e, o) {
        global.coffee = o.result;
        console.log('global.coffee');
        console.log(JSON.stringify(coffee, null, 2));
        console.log('executing b');
        eval(coffee['coffee/sub/b']);
        console.log('b=' + b);
        assert(b === 456);
        done(e);
      });
    });
    it('should be able to load modules', function(done) {
      var c;
      c = gqcoffee.requireFromString(coffee['coffee/requiretest']);
      assert(c.c === 789);
      done();
    });
    return it('should be able to load coffees using q_load', function(done) {
      gqcoffee.q_load().then(function() {
        eval(coffee['coffee/sub/b']);
        console.log('b=' + b);
        assert(b === 456);
      }).done(done);
    });
  });

}).call(this);
