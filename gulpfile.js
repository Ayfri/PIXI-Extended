const gulp = require('gulp');
const esbuild = require('gulp-esbuild');
const {exec} = require('child_process');

function bundle() {
	return gulp
		.src('./src/index.ts')
		.pipe(esbuild({
			bundle: true,
			format: 'esm',
			keepNames: true,
			loader: {
				'.ts': 'ts',
			},
			minify: true,
			minifyIdentifiers: true,
			minifySyntax: true,
			minifyWhitespace: true,
			outfile: 'bundle.js',
			sourcemap: 'both',
			target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
		}))
		.pipe(gulp.dest('./dist/'));
}

function watch() {
	exec('reload --browser --dir=dist --port=5000', err => {
		if (err) throw err;
	});

	return gulp.watch(['src/**/*.*', 'gulpfile.js'], bundle);
}

exports.bundle = bundle;
exports.watch = watch;
