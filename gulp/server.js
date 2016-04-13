// Server Task
/////////////////////////////////////////
'use strict';

const gulp            = require('gulp'),
      browserSync     = require('browser-sync').create();

const watchFiles = [
  './dist/*.html',
  './dist/assets/css/*.css',
  './dist/assets/js/*.js'
];

gulp.task('server', () => {
  return browserSync.init(watchFiles, {
      server: {
      	baseDir: './dist'
      },
      reloadDelay: 500
  });
});

