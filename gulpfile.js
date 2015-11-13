var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var scripts = [
  'server/**/*.js',
  'client/js/**/*.js'
];

var nodemonConfig = {
  script: 'server/app.js',
  ext: 'js jade',
  ignore: [
    'node_modules/**',
    'client/**'
  ],
  env: {
    NODE_ENV: 'development'
  }
};

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon(nodemonConfig)
    .on('start', function() {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function() {
      setTimeout(function() {
        console.log('-------- 重启 --------');
        reload({
          stream: false
        });
      }, 1000);
    });
});

gulp.task('browser-sync', ['nodemon'], function(done) {
  browserSync({
    proxy: "localhost:3000", //项目端口 
    port: 5000,  // 浏览器访问端口
    notify: true
  }, done);
});

gulp.task('lint', function() {
  return gulp.src(scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch(scripts, ['lint']);
});

gulp.task('default', ['browser-sync','watch']);