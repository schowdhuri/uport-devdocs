import gulp from 'gulp';
import copyMarkdown from "./gulp/copy";
import watchMarkdown from "./gulp/watch";

let argv = require('minimist')(process.argv.slice(2));
let $g = require('gulp-load-plugins')();

if (argv.pathPrefix && argv.pathPrefix[0] !== '/') {
  throw new Error('The --pathPrefix argument must start with a "/"');
}

const PATH_PREFIX = argv.pathPrefix || '';

gulp.task('copy-markdown', copyMarkdown)
gulp.task('watch:markdown', watchMarkdown)
