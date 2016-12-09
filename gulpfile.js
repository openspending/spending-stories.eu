'use strict';

var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var resolve = require('resolve');
var stringify = require('stringify');

var frontSrcDir = path.join(__dirname, '/app');
var frontStylesDir = path.join(frontSrcDir, '/styles');
var frontScriptsDir = path.join(frontSrcDir, '/scripts');
var frontImagesDir = path.join(frontSrcDir, '/images');
var frontDataDir = path.join(frontSrcDir, '/data');

var publicDir = path.join(__dirname, '/public');
var publicScriptsDir = path.join(publicDir, '/scripts');
var publicStylesDir = path.join(publicDir, '/styles');
var publicImagesDir = path.join(publicDir, '/images');
var publicDataDir = path.join(publicDir, '/data');

gulp.task('default', [
  'app.scripts',
  'app.styles',
  'app.images',
  'app.data'
]);

gulp.task('app.scripts', function () {
  var bundler = browserify({
    standalone: 'application'
  })
          .transform(stringify, {
            appliesTo: {
              includeExtensions: ['.html']
            },
            minify: false
          });

  bundler.require(resolve.sync(frontScriptsDir), {expose: 'application'});

  return bundler.bundle()
          .pipe(source('app.js'))
          .pipe(buffer())
          //.pipe(uglify())
          .pipe(gulp.dest(publicScriptsDir));
});

gulp.task('app.styles', function () {
  var files = [
    path.join(frontStylesDir, '/styles.less')
  ];
  return gulp.src(files)
          .pipe(sourcemaps.init())
          .pipe(less())
          .pipe(prefixer({browsers: ['last 4 versions']}))
          .pipe(minifyCss({compatibility: 'ie8'}))
          .pipe(concat('app.css'))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(publicStylesDir));
});

gulp.task('app.images', function () {
  return gulp.src(path.join(frontImagesDir, '/**/*'))
    .pipe(gulp.dest(publicImagesDir));
});

gulp.task('app.data', function () {
  return gulp.src(path.join(frontDataDir, '/**/*'))
    .pipe(gulp.dest(publicDataDir));
});
