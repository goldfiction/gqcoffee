/**
 * Created by happy on 3/23/17.
 */

var assert=require('assert');
var gqcoffee=require('../main.js');


it('should be able to load coffees',function(done){
    gqcoffee.load({path:"test/coffee"},function(e,coffee){
        global.coffee=coffee;
        console.log("global.coffee");
        console.log(JSON.stringify(coffee,null,2));
        console.log('executing b');
        eval(coffee['test/coffee/sub/b']);
        console.log('b='+b);
        assert(b==456);
        done(e);
    });
});

it('should be able to load modules',function(done){
    var c=gqcoffee.requireFromString(coffee['test/coffee/requiretest']);
    assert(c.c==789);
    done();
});