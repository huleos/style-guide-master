// Templates Task
/////////////////////////////////////////
'use strict';

const gulp      = require('gulp'),
    	panini    = require('panini'),
			plumber   = require('gulp-plumber');
 
gulp.task('pages', () => {
  return gulp.src('./src/views/pages/**/*.{html,hbs,handlebars}')
  	.pipe(plumber())
    .pipe(panini({
    	root: './src/views/pages/',
      layouts: './src/views/layouts/',
      partials: './src/views/partials/'
    }))
    .pipe(gulp.dest('./dist'));
}
);

gulp.task('pages:reset', (done) => {
  panini.refresh();
  gulp.run('pages');
  done();
});