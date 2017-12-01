const gulp = require('gulp'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      tsify = require('tsify'),
      paths = {
        pages: ['src/*.html']
      };

gulp.task("copy-html", ()=>{
    return gulp.src(path.pages)
        .pipe(gulp.dest("dist"))
});

gulp.task('defaults', ['copy-html'], ()=>{
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
    .pip(gulp.dest('dist'));
});
