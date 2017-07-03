var gulp = require('gulp');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var watchify = require('watchify');
var merge = require('utils-merge');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var clean = require('gulp-clean');

var request = require('request');
var path = require( 'path' );
var criticalcss = require("criticalcss");
var fs = require('fs');
var tmpDir = require('os').tmpdir();

var bundler;

var themePath = './wp-content/themes/zephyr';
var siteUrl = 'http://zephyr.dev';

function getBundler(src, presets) {

  var args = merge(watchify.args, { debug: true })

  if(!presets) {
    var presets = ['es2015']
  }

  if (!bundler) {
    bundler = watchify(browserify(src, {
      basedir: __dirname, 
      debug: process.env.NODE_ENV != 'production',
      cache: {}, // required for watchify
      packageCache: {}, // required for watchify
      fullPaths: process.env.NODE_ENV != 'production' // required to be true only for watchify
    }))
    .transform(babelify, { presets: presets })
  }

  return bundler;

}

// Bundles and creates both unminified and minified versions
function bundleScripts(bundler, outputName, outputDir) {

  var b = bundler
    .bundle()
    .on('error', function(err) {
      console.log('Error: ' + err);
      this.emit('end');
    })

    // Unminified version
    .pipe(source(outputName))
    .pipe(clean({ read: false }))
    .pipe(gulp.dest(outputDir))
    .pipe(buffer())

  b.pipe(browserSync.stream({once: true}))

  return b
}

function buildScripts(src, outputDir) {

  return gulp.src(src)
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(outputDir))
    .on('end', function() {
      process.exit()
    })
}

function processScripts(src, output, listen) {

  if(!listen) {
    listen = true
  }

  var bundler = getBundler(themePath + '/src/' + src, [ 'es2015' ])
  
  if(listen) {
    bundler.on('update', function () {
      return bundleScripts(bundler, output, themePath + '/dist/scripts/')
    })
  }

  return bundleScripts(bundler, output, themePath + '/dist/scripts/')
}

// Runs core style tasks
function processStyles(src, outputDir) {

  return gulp.src(src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 2 versions', 'ie 10', 'Firefox > 23', 'Chrome > 23', 'ios >= 6', 'android 2.3', 'android 4']))
    .pipe(gulp.dest(outputDir))
    // then rename and optimize it
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss({
      relativeTo: outputDir,
      processImport: true
    }))
    .pipe(gulp.dest(outputDir))

}

gulp.task('scripts', function(){
  return processScripts('scripts/public.js', 'public.js', false)
    .on('end', function() {
      process.exit()
    })
});

gulp.task('styles', function(){
  return processStyles(
    themePath + '/src/styles/public.scss', 
    themePath + '/dist/styles/'
  );
});

gulp.task('critical', function() {

  var cssUrl = siteUrl + themePath.replace('.', '') + '/dist/styles/public.css';
  var cssPath = path.join( tmpDir, 'inline.css' );

  request(cssUrl).pipe(fs.createWriteStream(cssPath)).on('close', function() {
    criticalcss.getRules(cssPath, function(err, output) {
      if (err) {
        throw new Error(err);
      } else {
        criticalcss.findCritical(siteUrl, { 
          rules: JSON.parse(output),
          ignoreConsole: true,
          width: 1920,
          height: 1080
        }, function(err, output) {
          if (err) {
            throw new Error(err);
          } else {

            var src = themePath + '/dist/styles/inline.css'
            var outputDir = themePath + '/dist/styles/'

            fs.writeFileSync(src, output)
            gulp.src(src)
              .pipe(rename({suffix: '.min'}))
              .pipe(minifycss({
                relativeTo: outputDir,
                processImport: true
              }))
              .pipe(gulp.dest(outputDir))
          }
        });
      }
    });
  });

})

gulp.task('build', function() {

  process.env.NODE_ENV = 'production';

  return processScripts('scripts/public.js', 'public.js', false)
    .on('end', function() {
      buildScripts(
        themePath + '/dist/scripts/public.js', 
        themePath + '/dist/scripts/'
      )
    })

});

// Common watch task
gulp.task('watch', function() {

  browserSync.init({
    files: [
      themePath + '/dist/styles/public.css',
    ],
    proxy: siteUrl
  })

  gulp.watch(themePath + '/src/styles/**/*.scss', ['styles']);

  processScripts('scripts/public.js', 'public.js', true);

  // Trigger reloading when any of these files change
  gulp.watch([
    themePath + '/**/*.twig',
    themePath + '/**/*.php'
  ]).on('change', browserSync.reload)

});

// Default Task
gulp.task('default', ['build']);

