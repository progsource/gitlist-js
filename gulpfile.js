var gulp = require('gulp'),
    concat = require('gulp-concat')

    scriptDestination = './app/public/scripts/min',
    styleDestination = './app/public/styles/min';

gulp.task('jquery-and-bootstrap', function() {
    return gulp.src([
        './app/public/scripts/vendor/jquery/dist/jquery.min.js',
        './app/public/scripts/vendor/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(concat('jqboot.js'))
        .pipe(gulp.dest(scriptDestination));
});

gulp.task('codemirror', function() {
    return gulp.src([
        './app/public/scripts/vendor/CodeMirror/lib/codemirror.js'
    ])
        .pipe(concat('cm.js'))
        .pipe(gulp.dest(scriptDestination));
});

gulp.task('style', function() {
    return gulp.src([
        './app/public/scripts/vendor/bootstrap/dist/css/bootstrap.min.css',
        './app/public/scripts/vendor/CodeMirror/lib/codemirror.css',
        './app/public/scripts/vendor/CodeMirror/theme/mdn-like.css',
        './app/public/styles/base.css'
    ])
        .pipe(concat('style.css'))
        .pipe(gulp.dest(styleDestination));
})

gulp.task('default', [
    'jquery-and-bootstrap',
    'codemirror',
    'style'
]);
