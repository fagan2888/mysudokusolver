var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify');

gulp.task('default', ['watch']);

gulp.task('watch', function() {
    gulp.watch('./src/styles/*.scss', ['process-styles']);
    gulp.watch('./src/scripts/**/*.js', ['process-scripts']);
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
