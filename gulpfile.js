var gulp = require('gulp'),
    packageJson = require('./package.json'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    jshintConfig = packageJson.jshintConfig,
    jscs = require('gulp-jscs'),
    Server = require('karma').Server;

gulp.task('default', function() {
});
 
gulp.task('jshint', function() {
    return gulp.src(['client/app/**/*.js', 'test/unit/**/*.js', 'server/**/*.js'])
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(jshintStylish));
});

gulp.task('jscs', function() {
    return gulp.src(['client/app/**/*.js', 'test/unit/**/*.js', 'server/**/*.js'])
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('check', gulp.series('jshint', 'jscs')); 

gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('tdd', function(done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js'
  }, done).start();
});

