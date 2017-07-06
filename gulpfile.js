var gulp = require('gulp'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    minify = require('gulp-minify'),
    uglify = require('gulp-uglify'),
    debug = require('gulp-debug');

var files = [
  './web/assets/Enemy.js', './web/assets/Map.js', './web/assets/NPC.js', './web/assets/Player.js',
  './web/assets/Scenes/*.js',
  './web/assets/Network.js',
];

gulp.task('prod', function(){
  var filesProduction = files;
  filesProduction.push('./web/assets/Game.js');

  return gulp.src(filesProduction)
  .pipe(concat('game.js'))
  .pipe(gulp.dest('./web/'))
});

gulp.task('dev', function(){
  var filsDev = files;
  filesDev.push('./web/assets/GameDev.js');

  return gulp.src(filesDev)
  .pipe(concat('game-dev.js'))
  .pipe(gulp.dest('./web/'));
});

gulp.task('prod-watch', function(){
  livereload.listen();
  gulp.watch(['./web/assets/*.js', './web/assets/*/*.js'], ['prod-watch']);
});

gulp.task('dev-watch', function(){
  livereload.listen();
  gulp.watch(['./web/assets/*.js', './web/assets/*/*.js'], ['dev']);
})

gulp.task('default', ['dev', 'prod']);
