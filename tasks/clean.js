const { themePath, paths } = require('../config.json')
const gulp = require('gulp')
const del = require('del')

gulp.task('clean', function() {
  return del(themePath +  paths.dist.scripts + '*.js')
})