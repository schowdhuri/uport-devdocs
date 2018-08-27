import {exec} from "child_process";
import gulp from 'gulp';

let watch = require('gulp-watch');

gulp.task('watch:markdown', function() {
  return watch(["./markdown/**/*.*"], function() {
    gulp.start('copy-markdown');
  });
});

// function() {
//   //gulp.start('copy-files');
//   gulp.run(['copy-files']);
// }
