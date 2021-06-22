const gulp = require('gulp');
const esbuild = require('gulp-esbuild');
const clean = require('gulp-clean');
const {exec} = require('child_process');

/**
 * @type {Omit<Options>}
 */
const esbuildOptions = {
	bundle: true,
	format: 'cjs',
	keepNames: true,
	minifySyntax: true,
	minifyWhitespace: true,
	outfile: 'index.js',
	sourcemap: false,
	target: ['node14'],
};

function bundle() {
	return gulp.src('./src/index.ts').pipe(esbuild(esbuildOptions)).pipe(gulp.dest('dist'));
}

function watch() {
	exec('reload --browser --dir=tests --port=5000', err => {
		if (err) throw err;
	});

	return gulp.watch(['src/**/*.*', 'gulpfile.js'], bundle);
}

gulp.task('clean', () => {
	return gulp.src('types', {read: false, allowEmpty: true}).pipe(clean());
});

exports.bundle = bundle;
exports.watch = watch;
