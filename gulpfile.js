var gulp = require('gulp'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    minify = require('gulp-minify'),
    uglify = require('gulp-uglify'),
    debug = require('gulp-debug');

var files = [
  './web/assets/Enemy.js', './web/assets/Map.js', './web/assets/NPC.js', './web/assets/Player.js',
  './web/assets/Scenes/*.js',
  './web/assets/Game.js'
];

gulp.task('prod', function(){
  return gulp.src(files)
  .pipe(uglify())
  .pipe(concat('game.js'))
  .pipe(gulp.dest('./web/'))
});

gulp.task('dev', function(){
  return gulp.src(files)
  .pipe(concat('game-dev.js'))
  .pipe(gulp.dest('./web/'));
});

gulp.task('watch', function(){
  livereload.listen();
  gulp.watch(['./web/assets/*.js', './web/assets/*/*.js'], ['dev']);
})

gulp.task('default', ['dev', 'prod']);
