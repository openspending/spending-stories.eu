'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var cleanCss = require('gulp-clean-css');
var prefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var frontSrcDir = path.join(__dirname, '/app');
var frontStylesDir = path.join(frontSrcDir, '/styles');
var frontImagesDir = path.join(frontSrcDir, '/images');
var frontDataDir = path.join(frontSrcDir, '/data');

var publicDir = path.join(__dirname, '/public');
var publicStylesDir = path.join(publicDir, '/styles');
var publicImagesDir = path.join(publicDir, '/images');
var publicDataDir = path.join(publicDir, '/data');

gulp.task('default', [
  'app.styles',
  'app.images',
  'app.data'
]);

gulp.task('app.styles', function() {
  var files = [
    path.join(frontStylesDir, '/styles.less')
  ];
  return gulp.src(files)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(prefixer({browsers: ['last 4 versions']}))
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(publicStylesDir));
});

gulp.task('app.images', function() {
  return gulp.src(path.join(frontImagesDir, '/**/*'))
    .pipe(gulp.dest(publicImagesDir));
});

gulp.task('app.data', function() {
  return gulp.src(path.join(frontDataDir, '/**/*'))
    .pipe(gulp.dest(publicDataDir));
});
