import gulp from 'gulp';
import nodemon from 'gulp-nodemon';

gulp.task('server', () => {
  nodemon({
    exec: 'npm run babel-node -- ./bin/server.js',
    ext: 'js pug',
    watch: '.',
  });
});

