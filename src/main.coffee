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
  o=o or {}
  path2 = o.path or 'coffee'
  coffees = {}
  console.log 'loading coffee scripts from path: ' + path2
  fsReaddir path2, (e, files) ->
    if e
      console.log e.stack
      cb e
    else
      async.each files, ((file, cb) ->
        if file.toLowerCase().indexOf('.coffee') != -1
          try
            filename = file.toLowerCase().replace(/\.coffee/g, '').replace(/\\/g, '\/')
            console.log filename
            coffees[filename] = CoffeeScript.compile(fs.readFileSync(file).toString()) or ''
            cb null,o
          catch e
            console.log e.stack
            cb e
        else
          cb null
      ), (e) ->
        if e
          console.log e.stack
        o.result = coffees
        global.coffee = global.coffee || {}
        global.coffee = _.extend(global.coffee, o.result)
        cb e, o
      null
  null

q_load=(o)->
  o=o||{}
  o.query=load
  return doQ o

exports.load = load
exports.requireFromString = require('require-from-string')
exports.q_load = q_load
