var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var reload = browserSync.reload

gulp.task('default', function () {

  browserSync.init({
    server: {
      baseDir: ['./src', './'],
      index: './src/index.html'
    }
  })

  gulp.watch('./src/**/*').on('change', reload)
})
