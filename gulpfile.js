'use strict';

const gulp            = require('gulp'),
			sequence        = require('run-sequence'),
			panini          = require('panini'),
			imagemin        = require('gulp-imagemin'),
			uglify          = require('gulp-uglify'),
			concat          = require('gulp-concat'),
			sass            = require('gulp-sass'),
			prefix          = require('gulp-autoprefixer'),
			sourcemaps      = require('gulp-sourcemaps'),
			plumber         = require('gulp-plumber'),
			gutil           = require('gulp-util'),
			del             = require('del'),
			browserSync     = require('browser-sync').create();


// Check for --production flag
const PRODUCTION = gutil.env.production;


// Javascript Paths
const jsFiles = [
	'./node_modules/jquery/dist/jquery.js',
	'./node_modules/foundation-sites/dist/js/foundation.js',
	'src/assets/js/index.js'
];


// Copy page templates into finished HTML files
gulp.task('pages', () => {
  return gulp.src('src/views/pages/**/*.{html,hbs,handlebars}')
    .pipe(plumber())
    .pipe(panini({
      root: 'src/views/pages/',
      layouts: 'src/views/layouts/',
      partials: 'src/views/partials/',
      data: 'src/views/data/'
    }))
    .pipe(gulp.dest('dist'));
});


// Load updated HTML templates and partials into Panini
gulp.task('resetPages', (done) => {
  panini.refresh();
  done();
});


// Compile Scss
gulp.task('styles', () => {
	return gulp.src('src/assets/scss/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			includePaths: [
				'./node_modules/foundation-sites/scss'
			]
		}).on('error', sass.logError))
		.pipe(prefix({
			browsers: [
				'last 4 versions',
				'ie >= 9'
			],
			cascade: false
		}))
		.pipe(PRODUCTION ? sass({outputStyle: 'compressed'}) : gutil.noop())
		.pipe(!PRODUCTION ? sourcemaps.write('.') : gutil.noop())
		.pipe(gulp.dest('dist/assets/css'));
});


// Combine JavaScript into one file
gulp.task('scripts', () => {
		return gulp.src(jsFiles)
		.pipe(plumber())
		.pipe(sourcemaps.init())
	  .pipe(concat('bundle.js'))
	  .pipe(PRODUCTION ? uglify()
	  	.on('error', e => { console.log(e); })
	  	: gutil.noop())
		.pipe(!PRODUCTION ? sourcemaps.write('.') : gutil.noop())
	  .pipe(gulp.dest('dist/assets/js'));
});


// Copy images to the 'dist' folder
gulp.task('images', () => {
	return gulp.src('src/assets/img/**/*')
		.pipe(plumber())
	  .pipe(PRODUCTION ?
			imagemin({
				optimizationLevel: 5,
				progressive: true,
				interlaced: true
			}) : gutil.noop())
	  .pipe(gulp.dest('dist/assets/img'));
});


// Delete the 'dist' folder
gulp.task('clean', () => {
  return del('dist');
});


// Start a server with BrowserSync to preview the site in
gulp.task('server', ['build'], (done) => {
	browserSync.init({
		server: {
			baseDir: "dist"
		},
			port: 4567,
			reloadDelay: 500,
			reloadDebounce: 500
	});
	done();
});


// Build the "dist" folder by running all of the below tasks
gulp.task('build', (done) => {
	sequence('clean', ['pages', 'styles', 'scripts', 'images'], done);
});


// Build the site, run the server, and watch for file changes
// Watch for changes to static assets, pages, Scss, and JavaScript
gulp.task('default', ['server'], () => {
	gulp.watch(['src/views/**/*.{html,hbs,handlebars}'], ['pages']).on('change', browserSync.reload);
	gulp.watch(['src/views/{layouts,partials,helpers,data}/**/*'], ['resetPages']);
	gulp.watch(['src/assets/scss/**/*.scss'], ['styles']).on('change', browserSync.reload);
	gulp.watch(['src/assets/js/**/*.js'], ['scripts']).on('change', browserSync.reload);
	gulp.watch(['scr/assets/img/**/*'], ['images']).on('change', browserSync.reload);
});




