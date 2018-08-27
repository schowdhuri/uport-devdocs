import gulp from 'gulp';

let argv = require('minimist')(process.argv.slice(2));
let $g = require('gulp-load-plugins')();

if (argv.pathPrefix && argv.pathPrefix[0] !== '/') {
  throw new Error('The --pathPrefix argument must start with a "/"');
}

const PATH_PREFIX = argv.pathPrefix || '';

import "./gulp/watch";
import "./gulp/copy";
