import MemoryFS from 'memory-fs';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
import { getProjectLocation } from '../project-manager';

export const compileComponent = async (path: string) => {
	const resolvedPath = require.resolve(path, { paths: [getProjectLocation()] })
console.log('resolved path', resolvedPath)
	const fs = new MemoryFS()

	const compiler = webpack({
		entry: resolvedPath,
		output: {
			libraryTarget: 'var',
			library: 'lib',
			filename: 'main.js',
			path: '/dist'
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					use: 'vue-loader'
				}
			]
		},
		plugins: [new VueLoaderPlugin()]
	})

	compiler.outputFileSystem = fs
	const file = await new Promise((resolve, reject) => {
		compiler.run((error, stats) => {
			if (error) {
				reject(error)
			}

			const info = stats.toJson()

			if (stats.hasErrors()) {
				console.warn(info.errors)
			}

			if (stats.hasWarnings()) {
				console.warn(info.warnings)
			}

			const file = fs.readFileSync('/dist/main.js', 'utf8')

			resolve(file)
		})
	})

	return file
}
