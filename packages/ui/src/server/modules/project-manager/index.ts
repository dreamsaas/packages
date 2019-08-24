import { Server } from '@dreamsaas/types'
import chokidar from 'chokidar'
import isWindows from 'is-windows'

let server: Server
let watcher: chokidar.FSWatcher
let projectLocation: string

const formatPathForOS = (filePath: string) =>
	isWindows() ? filePath.replace('/', `\\\\`) : filePath

const formatPathForNode = (filePath: string) => filePath.replace(/\\/g, '/')

const clearRequireCache = (filePath: string) => {
	const osFilePath = formatPathForOS(filePath)
	if (require.cache[osFilePath]) {
		delete require.cache[osFilePath]
	}
}
/**
 *
 * @param path absolute path to file exporting run function for the server
 */
export const getServerRunner = filePath => {
	clearRequireCache(filePath)
	const { run } = require(filePath)
	return { run }
}

export const setProjectLocation = (location: string) =>
	(projectLocation = location)

export const getProjectLocation = () => projectLocation

export const watchFiles = (path: string, callback) => {
	const formattedPath = formatPathForNode(path)

	if (!watcher) {
		console.log(`Watching files at ${formattedPath}`)

		watcher = chokidar.watch(formattedPath)

		watcher.on('all', async (eventType: string, filePath: string) => {
			clearRequireCache(filePath)

			console.log('TODO: FILE WATCHER: ensure no parallel run')

			callback()
		})
	}
}

export const stopWatchingFiles = () => {
	watcher.close()
}
