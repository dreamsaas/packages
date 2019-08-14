import { Server } from '@dreamsaas/types'

import chokidar from 'chokidar'

function requireUncached(module) {
	delete require.cache[require.resolve(module)]
	return require(module)
}

let server: Server
let watcher: chokidar.FSWatcher
let projectLocation: string

/**
 *
 * @param path absolute path to file exporting run function for the server
 */
export const getServerRunner = path => {
	const { run } = requireUncached(path)
	return { run }
}

export const setProjectLocation = (location: string) =>
	(projectLocation = location)

export const getProjectLocation = () => projectLocation

export const watchFiles = (path: string, callback) => {
	const fromattedPath = path.replace(/\\/g, '/')

	if (!watcher) {
		console.log(`Watching files at ${fromattedPath}`)

		watcher = chokidar.watch(fromattedPath)

		watcher.on('all', async (eventType: string, filePath: string) => {
			const windowsFilePath = filePath.replace('/', `\\\\`)

			if (require.cache[windowsFilePath]) delete require.cache[windowsFilePath]
			if (require.cache[filePath]) delete require.cache[filePath]

			console.log('TODO: FILE WATCHER: ensure no parallel run')

			callback()
		})
	}
}

export const stopWatchingFiles = () => {
	watcher.close()
}
