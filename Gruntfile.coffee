module.exports = (grunt) ->
  grunt.initConfig
    coffee:
      compile:
        files:
          'lib/main.js': ['src/*.coffee']
          'test/test.js': ['test/*.coffee']
    mochaTest:
      options:
        reporter: 'nyan'
      src: ['test/*.coffee']
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-mocha-test'
  grunt.registerTask 'default', [
    'coffee',
    'mochaTest'
  ]