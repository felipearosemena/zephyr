/**
 *
 * For each item in the `config.scripts` array, a new `script` tag will be created.
 * The script `namespace` is used to differentiate them, separated by a colon
 *
 * Example:
 *
 * "scripts" : [
 *   { "name": "public", "namespace": false },
 *   { "name": "map",    "namespace": "map" }
 * ]
 *
 * this will generate the following tasks: `scripts`, `scripts:map`
 *
 */

const { scripts, themePath, paths } = require('../config.json')
const gulp = require('gulp')
const babelify = require('babelify')
const browserify = require('browserify')
const aliasify = require('aliasify')
const watchify = require('watchify')
const stringify = require('stringify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const merge = require('utils-merge')
const browserSync = require('browser-sync')

function getBundler(src, options) {

  const args = merge(watchify.args, { debug: true })
  const presets = ['es2015']
  const vueSuffix = process.env.NODE_ENV == 'production' ? 'min' : 'common'

  const bundler = watchify(browserify({
    entries: src,
    basedir: __dirname,
    debug: process.env.NODE_ENV != 'production',
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: process.env.NODE_ENV != 'production' // required to be true only for watchify
  }))
  .transform(stringify, {
    appliesTo: [ '.html' ]
  })
  .transform(babelify, { presets: presets })
  .transform(aliasify, {
    aliases: {
      'modules': themePath + '/src/scripts/modules',
      'app': themePath + '/src/scripts/app',
      'templates': themePath + '/src/views/app',
      'vue' : 'vue/dist/vue.' + vueSuffix,
      'vue-router' : 'vue-router/dist/vue-router.' + vueSuffix,
      'vue-resource' : 'vue-resource/dist/vue-resource.' + vueSuffix
    }
  })

  if(options.transforms) {
    options.transforms.map(transform => {
      bundler.transform(transform.name, transform.args)
    })
  }

  if(options.plugins) {
    options.plugins.map(plugin => {
      bundler.plugin(plugin.name, plugin.args)
    })
  }

  return bundler

}

function bundleScripts(bundler, filename) {

  const b = bundler
    .bundle()
    .on('error', err => {
      console.log('Error: ' + err)
    })
    .pipe(source(filename))
    .pipe(gulp.dest(themePath + paths.dist.scripts))
    .pipe(browserSync.stream({ once: true }))

  return b
}

function scriptTaskName(options) {
  return 'scripts' + (options.namespace ? ':' + options.namespace : '')
}

scripts.map(options => {

  const filename  = options.name + '.js'

  gulp.task(scriptTaskName(options), () => {
    const bundler = getBundler('.' + themePath + paths.src.scripts + filename, {})
    bundleScripts(bundler, filename)
  })

})

module.exports.scriptTaskName = scriptTaskName
module.exports.getBundler = getBundler
module.exports.bundleScripts = bundleScripts
