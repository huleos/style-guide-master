// Images Task
/////////////////////////////////////////
'use strict';

const gulp            = require('gulp'),
			imagemin        = require('gulp-imagemin'),
			plumber         = require('gulp-plumber');

gulp.task('images', () => {
	return gulp.src('./src/assets/img/**/*')
		.pipe(plumber())
	  .pipe(imagemin({
	  	optimizationLevel: 5,
	  	progressive: true,
	  	interlaced: true
	  }))
	  .pipe(gulp.dest('./dist/assets/img'));
});