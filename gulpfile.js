const gulp = require('gulp'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      tsify = require('tsify'),
      paths = {
        pages: ['src/*.html']
      };

gulp.task("copy-html", ()=>{
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"))
});

gulp.task('default', ['copy-html'], ()=>{
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});
