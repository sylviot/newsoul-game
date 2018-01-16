var gulp = require('gulp'),
    ts = require('gulp-typescript');

var tsproject = ts.createProject('./tsconfig.json');

gulp.task('scripts', function() {
  return gulp.src('./web/components/Main.ts')
    .pipe(tsproject())
    .pipe(gulp.dest('./web'));
})

gulp.task('watch', function() {
  // livereload.listen()
  return gulp.watch('./web/components/*', ['scripts'])
})

gulp.task('default', ['watch', 'scripts'])