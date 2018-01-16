###*
# Created by happy on 3/23/17.
###

CoffeeScript = require 'coffee-script'
fs = require 'fs'
fsReaddir = require 'fs-readdir'
async = require 'async'
_ = require 'lodash'
Q=require 'q'
doQ=require 'gqdoq'

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
        if file.indexOf('.coffee') != -1
          try
            filename = file.toLowerCase().replace(/\.coffee/g, '').replace(/\\/g, '\/')
            console.log filename
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

q_load1=(o)->
  o=o||{}
  o.query=load
  return doQ o

q_load2=(o)->
  o=o||{}
  o.query=(o,cb)->
    global.coffee = global.coffee || {}
    global.coffee = _.extend(global.coffee, o.result)
    cb()
  return doQ o

q_load=()->
  return q_load1()
    .then q_load2

exports.load = load
exports.requireFromString = require('require-from-string')
exports.q_load = q_load
