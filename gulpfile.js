const gulp = require('gulp');
const esbuild = require('gulp-esbuild');
const clean = require('gulp-clean');
const {exec} = require('child_process');

function bundle() {
	return gulp
		.src('./src/index.ts')
		.pipe(esbuild({
			bundle: true,
			format: 'esm',
			keepNames: true,
			minifySyntax: true,
			minifyWhitespace: true,
			outfile: 'bundle.js',
			sourcemap: 'external',
			target: ['chrome61', 'firefox79', 'safari11', 'edge18'],
		}))
		.pipe(gulp.dest('./dist/'));
}

function watch() {
	exec('reload --browser --dir=dist --port=5000', err => {
		if (err) throw err;
	});

	return gulp.watch(['src/**/*.*', 'gulpfile.js'], bundle);
}

gulp.task('clean', () => {
	return gulp.src('dist/typings.d.ts', {read: false, allowEmpty: true}).pipe(clean());
});


exports.bundle = bundle;
exports.watch = watch;
