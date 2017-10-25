const { scripts, themePath, paths, siteUrl } = require('../config.json')
const browserSync = require('browser-sync')
const gulp = require('gulp')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const { getBundler, bundleScripts } = require('./scripts')

require('./styles')

const watchThemePath = themePath.replace('./', '')

gulp.task('watch', () => {

  browserSync.init({
    files: [
      themePath + '/dist/styles/public.css',
    ],
    proxy: siteUrl
  })

  gulp.watch(watchThemePath + '/src/styles/**/*.scss', ['styles'])

  // Trigger reloading when any of these files change
  gulp.watch([
    watchThemePath + '/src/views/**/*.twig',
    watchThemePath + '/**/*.php'
  ], browserSync.reload)

  scripts.map(options => {

    const filename  = options.name + '.js'
    const bundler = getBundler('.' + themePath + paths.src.scripts + filename, {})

    bundleScripts(bundler, filename)
    bundler.on('update', () => {
      bundleScripts(bundler, filename)
    })

  })

});
