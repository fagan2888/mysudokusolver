var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

gulp.task('default', ['watch', 'browser-sync']);

gulp.task('watch', function() {
    gulp.watch('./src/styles/*.scss', ['process-styles']);
    gulp.watch('./src/scripts/**/*.js', ['process-scripts']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        files: './public/**/*'
    });
});

gulp.task('process-styles', function() {
    return gulp.src('./src/styles/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('process-scripts', function() {
    return gulp.src('./src/scripts/pages/*.js')
        .pipe(browserify())
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
});
