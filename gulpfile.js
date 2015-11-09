var gulp = require('gulp'),
	less = require('gulp-less'),
 	minifycss = require('gulp-minify-css'),
 	uglify = require('gulp-uglify'),
 	del = require('del');
// 编译less
gulp.task('build-less', function(){
    gulp.src('src/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('src/css/'))
});
// css
gulp.task('minifycss', function() {
    return gulp.src('src/css/style.css')
        .pipe(minifycss())
        .pipe(gulp.dest('dest/css'));
});
// js
gulp.task('minifyjs', function() {
    return gulp.src('src/build/bundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('dest/js'));
});
// clean
gulp.task('clean', function() {
    del(['dest/css/*.css','dest/js/*.js'])
});
// 异步执行任务
gulp.task('default',['clean'],function() {
    gulp.start('minifycss', 'minifyjs');
});
gulp.task('watch', function() {
  gulp.watch('src/less/*.less', ['build-less']);
});

