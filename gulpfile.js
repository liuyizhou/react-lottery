var gulp = require('gulp'),
 	less = require('gulp-less');

gulp.task('build-less', function(){
    gulp.src('less/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/'))
});

gulp.task('default', function() {
    gulp.start('build-less');
});
gulp.task('watch', function() {
  gulp.watch('less/*.less', ['build-less']);
});