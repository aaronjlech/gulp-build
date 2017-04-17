var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
const babel = require('gulp-babel');


gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('babel', () => {
    return gulp.src('dist/app.js')
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['browserSync', 'sass', 'babel'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Other watchers
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
})
gulp.task('default', function (callback) {
  runSequence(['babel' ,'sass','browserSync', 'watch'])
})
