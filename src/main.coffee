###*
# Created by happy on 3/23/17.
###

CoffeeScript = require('coffee-script')
fs = require('fs')
fsReaddir = require('fs-readdir')
async = require('async')
doQ = require('gqdoq')
_ = require('lodash')

load = (o, cb) ->
  path2 = o.path or 'coffee'
  coffees = {}
  console.log 'loading coffee scripts from path: ' + path2
  fsReaddir path2, (e, files) ->
    if e
      console.log e.stack
      cb e
    else
      async.each files, ((file, cb) ->
        console.log file
        pathnew = file
        filename = file.toLowerCase().replace('.coffee', '')
        if file.indexOf('.coffee') != -1
          try
            coffees[filename] = CoffeeScript.compile(fs.readFileSync(pathnew).toString()) or ''
            cb()
          catch e
            console.log e.stack
            cb e
        return
      ), (e) ->
        if e
          console.log e.stack
        o.result = coffees
        cb e, o
        return
    return
  return

q_load = (o) ->
  o=o||{};
  o.query = load
  doQ(o).then (o) ->
    global.coffee = global.coffee or {}
    global.coffee = _.extend(global.coffee, o.result)
    o

exports.load = load
exports.requireFromString = require('require-from-string')
exports.q_load = q_load

# ---
# generated by js2coffee 2.2.0