var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');

var src = {
  server: './src/server/**/*.cs',
  client: './src/client/**/*.cs'
};

var dst = {
  server: 'lib/canned-server.js',
  client: 'public/javascripts/canned-client.js'
};

var filenameAndPath = function(full) {
  var segs = full.split('/');
  return  {
    filename: segs.slice(-1).join(''),
    path: segs.slice(0, -1).join('/')
  };
};

var hasArg = function(arg) {
  var args = process.argv.slice(2);
  for(var i = 0; i < args.length; i++) {
    if(args[i] == arg) return true;
  }
  return false;
};

var compile = function(srcGlob, dst) {
  var dstParts = filenameAndPath(dst);
  return gulp.src(srcGlob)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat(dstParts.filename))
    .pipe(gulpif(!hasArg('--no-uglify'), uglify()))
    .pipe(gulp.dest(dstParts.path));
};


// ---------------- TASKS ------------------------

gulp.task('default', function() {
  gulp.watch(src.server, ['scripts:server']);
  gulp.watch(src.client, ['scripts:client']);
});

gulp.task('scripts:client', function() {
  return compile(src.client, dst.client);
});

gulp.task('scripts:server', function() {
  return compile(src.server, dst.server);
});

gulp.task('clean', function() {
  return gulp.src([dst.server, dst.client]).pipe(clean()); 
});

gulp.task('build', ['scripts:client', 'scripts:server']);


