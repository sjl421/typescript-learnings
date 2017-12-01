const gulp = require('gulp'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      watchify = require('watchify'),
      tsify = require('tsify'),
      gutil = require('gulp-util');

let paths = {
    pages: ["src/*.html"]
};

let watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {}
// tsify 是browserify的插件，用于编译 TypeScript, 选项写在后面
}).plugin(tsify, { noImplicitAny: true }));

gulp.task("copy-html", ()=>{
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"))
});

function bundle () {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"))
}

gulp.task('default', ['copy-html'], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
