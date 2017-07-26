/**
 *
 * Build Task
 *
 * This project is configured to be able to have multiple bundles produced. The bundles
 * to create are configured via `config.json` under the `scripts` array.
 *
 * Each row in the array will generate a bundled script in the dist folder.
 *
 * An additional `common` bundle will get generated which contains the modules common
 * among all declared bundles, avoiding repeated code/library loading across builds
 *
 * If only 1 bundle is specified in scripts, no `common` bundle gets generated
 * 
 */


const gulp = require('gulp')
const { getBundler, scriptTaskName } = require('./scripts')
const { themePath, paths, scripts, commonScriptName } = require('../config.json')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

require('./clean')
require('./styles')

function buildScripts(scripts) {

  const plugins = []
  const outputFilename = scripts.length > 1 ? 
    commonScriptName +'.min.js' : 
    scripts[0].name  + '.min.js'

  const src = scripts.map(script => {
    return '.' + themePath + paths.src.scripts + script.name + '.js'
  })

  if(scripts.length > 1) {

    const o = scripts.map(script => {
      return themePath + paths.dist.scripts + script.name + '.min.js'
    })

    plugins.push({
      name: 'factor-bundle',
      args: {
        output: o
      }
    })
  }

  const b = getBundler(src, {
    transforms: [{
      name: 'uglifyify',
      args: { global: true }
    }],
    plugins: plugins
  })
  .bundle()
  .on('error', function(err) {
    console.log('Error: ' + err)
    this.emit('end')
  })
  .pipe(source(outputFilename))
  .pipe(gulp.dest(themePath + paths.dist.scripts))

  return b

}

gulp.task('build', [ 'clean', 'styles' ].concat(scripts.map(scriptTaskName)) , function(done) {
  process.env.NODE_ENV = 'production'
  buildScripts(scripts)
    .on('end', function() {
      done()
      process.exit()
    })
})