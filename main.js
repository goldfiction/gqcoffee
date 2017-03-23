/**
 * Created by happy on 3/23/17.
 */
var CoffeeScript = require('coffee-script');
var fs = require( 'fs' );
var path=require('path');
var fsReaddir = require('fs-readdir');
var async=require('async');
var requireFromString = require('require-from-string');


function load(o,cb){
    var path2= o.path||"coffee";
    var coffees={};
    console.log('loading coffee scripts from path: '+path2);
    fsReaddir(path2,function(e,files){
        if( e ) {
            console.log(e.stack);
            cb(e);
        }else{
            async.each(files,function(file,cb){
                console.log(file)
                var pathnew=file;
                var filename=file.toLowerCase().replace('.coffee',"");
                if (file.indexOf('.coffee') != -1) {
                    try {
                        coffees[filename] = (CoffeeScript.compile(fs.readFileSync(pathnew).toString())) || "";
                        cb();
                    } catch (e) {
                        console.log(e.stack);
                        cb(e);
                    }
                }
            },function(e){
                if(e){
                    console.log(e.stack);
                }
                cb(e,coffees);
            })
        }
    })
}

exports.load=load;

exports.requireFromString=requireFromString;