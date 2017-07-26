/**
 *
 * Gulp Tasks
 *
 * IMPORTANT: Make sure `tasks/config.json` is configured properly:
 *
 *  siteUrl   : your local development domain (eg: base.dev). Used to proxy browsersync.
 *  themePath : Relative path to your theme. Just replace the theme name with your current one
 *  scripts   : Array of scripts that you will use on the the project. Read more on `tasks/scripts` & `tasks/build`
 *             to learn more about the build process.
 * 
 */

const gulp = require('gulp')

require('./tasks/clean')
require('./tasks/styles')
require('./tasks/scripts')
require('./tasks/build')
require('./tasks/watch')

// Default Task
gulp.task('default', ['build']);

