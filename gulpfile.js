// concat = require('gulp-concat'),
// livereload = require('gulp-livereload'),
// minify = require('gulp-minify'),
// uglify = require('gulp-uglify'),
// rename = require('gulp-rename'),
// debug = require('gulp-debug');

var gulp = require('gulp'),
    ts = require('gulp-typescript');

gulp.task('scripts', function(){
  return gulp.src('./web/components/Main.ts')
    .pipe(ts({
      module: 'amd',
      outFile: 'game.js'
    }))
    .pipe(gulp.dest('./web'));
})

gulp.task('watch', function(){
  // livereload.listen()
  return gulp.watch('./web/components/*', ['scripts'])
})

gulp.task('default', ['watch', 'scripts'])