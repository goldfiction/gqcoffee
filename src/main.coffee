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
        pathnew = file
        filename = file.toLowerCase().replace('.coffee', '').replace(/\\/g, '\/')
        console.log filename
        if file.indexOf('.coffee') != -1
          try
            coffees[filename] = CoffeeScript.compile(fs.readFileSync(pathnew).toString()) or ''
            cb()
          catch e
            console.log e.stack
            cb e
      ), (e) ->
        if e
          console.log e.stack
        o.result = coffees
        cb e, o

q_load=(o)->
  o = o || {}
  o.query = load
  doQ(o).then ()->
    global.coffee = global.coffee || {}
    global.coffee = _.extend(global.coffee, o.result)

exports.load = load
exports.requireFromString = require('require-from-string')
exports.q_load = q_load
