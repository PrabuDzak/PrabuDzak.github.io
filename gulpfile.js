var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var replace     = require('gulp-string-replace');
var sequence    = require('run-sequence');

var devPath    = './';
var buildPath  = '_site/';

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', function (cb) {
    sequence('jekyll-build', 'svg', 'reload', cb)
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: buildPath
        },
        notify: true,
        ghostMode: false
    });
});

gulp.task('reload', function(){
    browserSync.reload();
})

/**
 * Compiling sass scss file to css  
 */
gulp.task('sass', function () {
    return gulp.src(devPath + 'assets/css/main.scss')
        .pipe(sass({
            includePaths: ['css'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest(buildPath + 'assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest(devPath + 'assets/css'));
});

/**
 * adding web absolute path to xlink
 */
gulp.task('svg', function(){
    return gulp.src(devPath + 'assets/img/*.svg')
        .pipe(replace('xlink:href="(.*)"', function(rep){
            rep = rep.replace('/assets/img/', '');
            rep = rep.replace('xlink:href="', 'xlink:href="/assets/img/');
            return rep;
        }))
        .pipe(gulp.dest(buildPath + 'assets/img'))
        .pipe(gulp.dest(devPath + 'assets/img'))
})

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(devPath + 'assets/css/**', ['sass']);
    gulp.watch(devPath + 'assets/js/**', ['jekyll-rebuild']);
    gulp.watch(devPath + 'assets/img/**.svg', ['svg']);
    gulp.watch([devPath + '*.html', devPath + '_layouts/*.html'], ['jekyll-rebuild']);
    gulp.watch(devPath + '_posts/**/*.md', ['jekyll-rebuild']);
    gulp.watch([devPath + '_includes/**/*.html', devPath + '_includes/*.html' ], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
