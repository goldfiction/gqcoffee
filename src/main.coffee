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
UglifyJS = require 'uglify-js'

debug=(require 'util').debug
global.coffee = global.coffee || {}
exports.requireFromString = require('require-from-string')

load = (o, cb) ->
  o=o || {}
  o.option=o.option || {}
  path2 = o.path || 'coffee'
  coffees = {}

  debug 'loading coffee scripts from path: ' + path2

  fsReaddir path2, (e, files) ->
    if e
      debug e.stack
      cb e
    else
      async.each files, ((file, cb) ->
        if file.toLowerCase().indexOf('.coffee') != -1
          try
            filename = file.toLowerCase().replace(/\.coffee/g, '').replace(/\\/g, '\/')
            debug filename
            coffees[filename] = CoffeeScript.compile(fs.readFileSync(file).toString(),(o.option)) || ''
            if(!o.option.nominify)   # minify code by default. To turn this off, set option.nominify to true
              coffees[filename]=UglifyJS.minify(coffees[filename],
                fromString:true
              ).code
            cb null,o
          catch e
            debug e.stack
            cb e
        else
          cb null
      ), (e) ->
        if e
          debug e.stack
        o.result = coffees
        @coffee = _.extend @coffee, o.result
        cb e, o
      null
  null

q_load=(o)->
  o=o||{}
  o.query=load
  return doQ o

exports.load = load
exports.q_load = q_load