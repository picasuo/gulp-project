// import gulpSass from 'gulp-sass'
// import dartSass from 'sass'
const { src, dest, watch, parallel, series } = require('gulp')

// !默认任务 series--串联任务  parallel--并联任务
exports.default = series(
  runLinter,
  parallel(generateCSS, generateHTML),
  runTests,
  browserSync
)

function mytask(cb) {
  cb()
}

function copy(cb) {
  src('routes/*.js').pipe(dest('copies'))
  cb()
}

// !处理css
const sass = require('gulp-sass')(require('sass'))

function generateCSS(cb) {
  src('sass/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(dest('public/stylesheets'))
    .pipe(sync.stream())
  console.log('css编译程序开始')
  cb()
}

// !处理html
const ejs = require('gulp-ejs')
const rename = require('gulp-rename')
function generateHTML(cb) {
  src('./views/index.ejs')
    .pipe(
      ejs({
        title: 'Hello Semaphore!'
      })
    )
    .pipe(
      rename({
        extname: '.html'
      })
    )
    .pipe(dest('public'))
  cb()
}

// !整理代码
const eslint = require('gulp-eslint')
function runLinter(cb) {
  return src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('end', function () {
      console.log('代码整理程序开始')
      cb()
    })
}

// !测试
const mocha = require('gulp-mocha')

function runTests(cb) {
  return src(['**/*.test.js'])
    .pipe(mocha())
    .on('error', function () {
      cb(new Error('Test failed'))
    })
    .on('end', function () {
      cb()
    })
}

// !监听变化
function watchFiles(cb) {
  // ?监听html变化
  watch('views/**.ejs', generateHTML)
  // ?监听scss变化
  watch('sass/**.scss', generateCSS)
  // ?监听js变化
  watch(['**/*.js', '!node_modules/**'], parallel(runLinter, runTests))
}

// !为实时重载创建服务器
const sync = require('browser-sync').create()
function browserSync(cb) {
  sync.init({
    server: {
      baseDir: './public'
    }
  })

  watch('views/**.ejs', generateHTML)
  watch('sass/**.scss', generateCSS)
  watch('./public/**.html').on('change', sync.reload)
  //   watch('./public/stylesheets/**.css').on('change', sync.reload)
}

exports.watch = watchFiles
exports.mytask = mytask
exports.copy = copy
exports.css = generateCSS
exports.html = generateHTML
exports.lint = runLinter
exports.test = runTests
exports.sync = browserSync
