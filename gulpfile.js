const gulp = require('gulp'),
      ts = require('gulp-typescript'),
      tsProject = ts.createProject('tsconfig.json');

gulp.task("default", ()=>{
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"))
});
