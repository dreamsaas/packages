import { Server } from '../../../types/index'

import chokidar from 'chokidar'

function requireUncached(module) {
	delete require.cache[require.resolve(module)]
	return require(module)
}

let server: Server
let watcher: chokidar.FSWatcher

/**
 *
 * @param path absolute path to file exporting run function for the server
 */
export const getServerRunner = path => {
	const { run } = requireUncached(path)
	return { run }
}

export const watchFiles = (path: string, callback) => {
	const fromattedPath = path.replace(/\\/g, '/')
	if (!watcher) {
		console.log(`Watching files at ${fromattedPath}`)
		watcher = chokidar.watch(fromattedPath)
		watcher.on('all', async () => {
			console.log('TODO: FILE WATCHER: ensure no parallel run')
			callback()
		})
	}
}

export const stopWatchingFiles = () => {
	watcher.close()
}
