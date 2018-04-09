var gulp = require("gulp");

var clean = require('gulp-clean');
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');

var minifyHtml = require("gulp-minify-html");
var critical = require('critical').stream;

var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var uncss = require('gulp-uncss');

var uglify = require("gulp-uglify");

var imagemin = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli = require('imagemin-zopfli');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminGiflossy = require('imagemin-giflossy');

var paths = {
  srcJS: "src/js/*.js",
  srcCSS: "src/css/*.css",
  srcSCSS: "src/scss/*.scss",
  srcHTML: "src/*.html",
  srcIMAGES: "src/images/*",
  vendorsJS: "src/vendors/*.js",
  vendorsCSS: "src/vendors/*.css",
  dist: "dist",
  distCSS: "dist/css",
  distJS: "dist/js",
  distIMAGES: "dist/images"
}

//============================ GENERAL ============================//

var browserSync = require('browser-sync').create();
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
});

// Clean Dist folder
gulp.task('clean-dist', function() {
  return gulp.src(paths.dist)
    .pipe(clean({ force: true }));
});


//============================ SASS ============================//

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: "./dist"
  });

  gulp.watch(paths.srcSCSS, ['sass']);
  gulp.watch(srcHTML).on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src(paths.srcSCSS)
    .pipe(sass())
    .pipe(gulp.dest(paths.srcCSS))
    .pipe(browserSync.stream());
});


//============================ CSS ============================//

gulp.task('minify-individual-css', function() {
  return gulp.src(paths.srcCSS)
    .pipe(autoprefixer('last 4 version'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('minify-merge-css', function() {
  return gulp.src([paths.vendorsCSS, paths.srcCSS])
    .pipe(concat("build.min.css"))
    .pipe(autoprefixer('last 4 version'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.distCSS));
});

//============================ HTML ============================//

gulp.task("minify-html", function() {
  gulp.src(paths.srcHTML)
    .pipe(minifyHtml())
    .pipe(gulp.dest(paths.dist));
});


gulp.task("critical-html", function() {
  gulp.src(paths.srcHTML)
    .pipe(gulp.dest(paths.dist))
    .pipe(critical({ base: 'dist/', inline: true, css: ['dist/css/build.min.css'] }))
    .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
    .pipe(gulp.dest(paths.dist));
});

//============================ JS ============================//

gulp.task("minify-individual-js", function() {
  gulp.src(paths.srcJS)
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJS));
});

gulp.task("minify-merge-js", function() {
  gulp.src(["src/vendors/head.min.js","src/vendors/jquery.min.js", "src/vendors/bootstrap.min.js", "src/vendors/*.js", "src/js/*.js"])
    .pipe(concat("build.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJS));
});

//============================ IMAGES ============================//

gulp.task('minify-images', function() {
  gulp.src(paths.srcIMAGES)
    .pipe(imagemin([
      //png
      imageminPngquant({
        speed: 1,
        quality: 98 //lossy settings
      }),
      imageminZopfli({
        more: true
      }),
      //gif
      // imagemin.gifsicle({
      //     interlaced: true,
      //     optimizationLevel: 3
      // }),
      //gif very light lossy, use only one of gifsicle or Giflossy
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3, //keep-empty: Preserve empty transparent frames
        lossy: 2
      }),
      //svg
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
      //jpg lossless
      imagemin.jpegtran({
        progressive: true
      }),
      //jpg very light lossy, use vs jpegtran
      imageminMozjpeg({
        quality: 90
      })
    ]))
    .pipe(gulp.dest(paths.distIMAGES))
});


gulp.task('watch', function() {
  gulp.watch([paths.srcJS, paths.vendorsJS], ['minify-merge-js']);
  gulp.watch([paths.srcCSS, paths.srcSCSS, paths.vendorsCSS], ['minify-merge-css']);
  // gulp.watch([paths.srcHTML], ['minify-html']);
  gulp.watch([paths.srcHTML], ['critical-html']);
  gulp.watch([paths.srcIMAGES], ['minify-images']);

  gulp.watch(srcHTML).on('change', browserSync.reload);
  gulp.watch(srcCSS).on('change', browserSync.reload);
  gulp.watch(srcJS).on('change', browserSync.reload);
  gulp.watch(srcIMAGES).on('change', browserSync.reload);
});


gulp.task("default", ["browser-sync",  "critical-html", "minify-merge-js", "minify-merge-css", "minify-images"]);