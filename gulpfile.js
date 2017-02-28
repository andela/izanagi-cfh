// fetch dependencies
'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
// changed from jshint to eslint
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const bower = require('gulp-bower');
// const mocha = require('gulp-mocha');
const sass = require('gulp-sass');
const Server = require('karma').Server;
const path = require('path');

const liveReload = browserSync.create().reload;


/* nodemon task to start server.js*/
gulp.task('nodemon', () => {
  nodemon({ script: 'server.js', ext: 'js' });
});
/* browser-sync task to observe
reloads on file changes
USAGE: "gulp browserSync"*/
gulp.task('browserSync', ['nodemon'], () => {
  browserSync.create({
    server: 'server.js',
    // port: 3000,
    reloadOnRestart: true
  });
});

/* sass task to compile/convert
 sass files to css
USAGE: "gulp sass"*/
gulp.task('sass', () => gulp.src('public/css/common.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/')));

/* bower task to install components
USAGE: "gulp lint"*/
gulp.task('install', () => bower()
        .pipe(gulp.dest('./public/lib/')));


/* karma task
USAGE: "gulp test"*/
gulp.task('test', (done) => {
  new Server({
    configFile: path.join(__dirname, 'karma.conf.js'),
    singleRun: true
  }, done).start();
});

/* task that watches all files
USAGE: "gulp watch"*/
gulp.task('watch', ['browserSync'], () => {
    // watch for changes in jade views and reload
  gulp.watch('app/views', liveReload);

    // watch for changes in js files and update
    // but do that only after
  gulp.watch(['public/js/**',
    'app/**/*.js'
  ], ['lint', liveReload]);

    // watch for changes in css files and update
  gulp.watch('public/views/**', liveReload);
  gulp.watch(['public/css/common.scss',
    'public.css/views/articles.scss'
  ], ['sass', liveReload]);
  gulp.watch('public/css/**', ['sass', liveReload]);
});


/* linting task
USAGE: "gulp lint"
runing "gulp lint" throws
NO ESLint CONFIGURATION Error
Update .eslintrc.json to use
and set .eslintrcignore configurations
where applicable*/
gulp.task('lint', () => gulp.src(['gruntfile.js',
  'public/js/**/*.js', 'test/**/*.js',
  'app/**/*.js'
]).pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()));

/* default task.
Usage: "gulp" */
/* NOTE: this default task depends on the lint task*/
gulp.task('default', [/*'lint', */'browserSync', 'sass']);
