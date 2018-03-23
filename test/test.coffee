###*
# Created by happy on 3/23/17.
###

assert = require('assert')
gqcoffee = require('../lib/main.js')
o = {version:"1.0"}
describe 'default', () ->
  it 'should be able to load coffees', (done) ->
    gqcoffee.load o, (e, o) ->
      global.coffee = o.result
      console.log 'global.coffee'
      console.log JSON.stringify(coffee, null, 2)
      console.log 'executing b'
      eval coffee['coffee/sub/b']
      console.log 'b=' + b
      assert b == 456
      done e
      return
    return
  it 'should be able to load modules', (done) ->
    # requirefromstring module pipe through. Use this gem to require a module written in coffee
    c = gqcoffee.requireFromString(coffee['coffee/requiretest'])
    assert c.c == 789
    done()
    return
  it 'should be able to load coffees using q_load', (done) ->
    gqcoffee.q_load().then(() ->
      # q_load does exactly the same thing as first test except it is q_tree compliant
      eval coffee['coffee/sub/b']
      console.log 'b=' + b
      assert b == 456
      return
    ).done done
    return
  it 'should be able to render with pass-in values', (done)->
    gqcoffee.q_load({option:{o1:"ddd",nominify:false}}).then (o)->
      console.log o.result
      done()


# ---
# generated by js2coffee 2.2.0