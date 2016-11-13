const gulp = require('gulp');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const inject = require('gulp-inject-string');
const binFolder = 'bin';

gulp.task('clean', function () {
  return gulp.src(binFolder, {read: false})
    .pipe(clean());
});

gulp.task('js', ['clean'], function() {
    return gulp.src('lib/*')
    .pipe(babel({
        presets: ['es2015'],
        plugins: ['transform-runtime', 'transform-async-to-generator']
    }))
    .pipe(gulp.dest(binFolder));
});

// This task is needed for installing scavenger globally
gulp.task('prepend-executable-type', ['js', 'clean'], function() {
    gulp.src(`${binFolder}/index.js`)
        .pipe(inject.prepend('#!/usr/bin/env node\n'))
        .pipe(gulp.dest(binFolder));
});

gulp.task('default', ['clean', 'js', 'prepend-executable-type']);

gulp.task('watch', ['clean', 'js', 'prepend-executable-type'], function () {
    gulp.watch('lib/*.js', ['clean', 'js', 'prepend-executable-type']);
});
