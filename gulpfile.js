var gulp = require('gulp')
var rename = require('gulp-rename')
var replace = require('gulp-replace')
var gulpWatch = require('gulp-watch')

// TODO 兼容模式
// gulp.task('init-file', function () {
//   return gulp.src(['./src/package/**/*'])
//     .pipe(gulp.dest('./dist'))
// })
gulp.task('init-file', function () {
  return gulp.src(['./src/package/**/*', '!./src/package/images/**/*'])
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch-file', () => {
  return gulpWatch('./src/package/**/*', () => {
    gulp.src('./src/package/**/*')
      .pipe(gulp.dest('./dist'))
  })
})

gulp.task('page', () => {
  var fileName = process.argv[3]

  if (0 !== fileName.indexOf('--')) {
    return new Error('错误：请输入页面名称 -pageName')
  } else {
    fileName = fileName.substr(2, fileName.length)

    return gulp.src('./src/template/**/*')
      // .pipe(rename({basename: fileName}))
      .pipe(replace('default', fileName))
      .pipe(gulp.dest('./src/pages/' + fileName))
  }
})
