import webpack from 'webpack'
import MemoryFS from 'memory-fs'
import { Express } from 'express'
import { join } from 'path'
const { VueLoaderPlugin } = require('vue-loader')
// TODO: switch this back to graphql
// TODO: figure out how to pass paths in configurations.
export default (app: Express) => {
	app.get('/get-component', (req, res) => {
		console.log('get-component')
		const fs = new MemoryFS()

		const compiler = webpack({
			entry: join(__dirname, './Test.vue'),
			output: {
				libraryTarget: 'var',
				library: 'lib',
				filename: 'main.js',
				// umdNamedDefine: true,
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
		// Input filesystem needs to be real for internal imports.
		// compiler.inputFileSystem = fs
		compiler.outputFileSystem = fs

		compiler.run((error, stats) => {
			if (error) {
				throw error
			}

			const info = stats.toJson()

			if (stats.hasErrors()) {
				console.warn(info.errors)
			}

			if (stats.hasWarnings()) {
				console.warn(info.warnings)
			}

			const file = fs.readFileSync('/dist/main.js', 'utf8')
			res.type('.js').send(file)
		})
	})
}
