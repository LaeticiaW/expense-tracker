
var gulp = require('gulp'),
    packageJson = require('./package.json'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    jshintConfig = packageJson.jshintConfig,
    jscs = require('gulp-jscs'),
    Server = require('karma').Server,
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

var srcDir = 'client/app/',
    buildDir = 'build/',
    buildJsFile = "expense-tracker.js",
    buildCssFile = "expense-tracker.css",
    allJsFiles = [srcDir + '**/*.js', 'test/unit/**/*.js', 'server/**/*.js'],
    appJsFiles = [srcDir + '**/*.js'],
    lessFiles = [srcDir + 'less/**/*.less'],
    lessIndexFile = srcDir + 'less/index.less',
    karmaConfig = __dirname + '/test/karma.conf.js';

gulp.task('jshint', function() {
    return gulp.src(allJsFiles)
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(jshintStylish));
});

gulp.task('jscs', function() {
    return gulp.src(allJsFiles)
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task('check', gulp.series('jshint', 'jscs'));

gulp.task('test', function(done) {
  new Server({
    configFile: karmaConfig,
    singleRun: true
  }, done).start();
});

gulp.task('tdd', function(done) {
  new Server({
    configFile: karmaConfig
  }, done).start();
});

gulp.task('less', function () {
  return gulp.src(lessIndexFile)
    .pipe(less({
      paths: [ lessFiles ]
    }))
    .pipe(rename(buildCssFile))
    .pipe(gulp.dest(buildDir + 'css'));
});

gulp.task('js', function() {
  return gulp.src(appJsFiles)
      .pipe(concat(buildJsFile))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir + 'js'));
});

gulp.task('build', gulp.series('less', 'js'));


gulp.task('watch', function() {
  gulp.watch(allJsFiles, gulp.series('check', 'test', 'build'));
  gulp.watch(lessFiles, gulp.series('less', 'build'));
});

gulp.task('default', gulp.series('check', 'build',  'watch'));




