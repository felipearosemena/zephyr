const { themePath, paths } = require('../config.json')

const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const minifycss = require('gulp-minify-css')

// Runs core style tasks
function processStyles(src, outputDir) {

  return gulp.src(src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 2 versions', 'ie 10', 'Firefox > 23', 'Chrome > 23', 'ios >= 6', 'android 2.3', 'android 4']))
    .pipe(gulp.dest(outputDir))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss({
      relativeTo: outputDir,
      processImport: true
    }))
    .pipe(gulp.dest(outputDir))

}

gulp.task('styles', () => {

  const srcDir  = themePath + paths.src.styles
  const distDir = themePath + paths.dist.styles

  processStyles( srcDir + 'public.scss', distDir )
  processStyles( srcDir + 'admin.scss', distDir )

})