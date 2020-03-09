import { EVENTS } from './dev-server'
import { FILE_WATCHER_EVENTS } from './file-watcher'
import { pipe } from '../utils'
import { addPipe } from './pipes'
import { addAction } from './actions'
import { IApplication, changeState } from './application'
import path from 'path'

const formatPathForNode = (filePath: string) => filePath.replace(/\\/g, '/')

const clearRequireCache = () => {
	for (let key in require.cache) {
		delete require.cache[key]
	}
}
/**
 *
 * @param path absolute path to file exporting run function for the server
 */
export const getAppBoostrap = (
	pathToAppBootstrap
): { bootstrap: (config: any) => Promise<IApplication> } => {
	// clearRequireCache(pathToAppBootstrap)
	const { bootstrap } = require(pathToAppBootstrap)
	//@ts-ignore
	return { bootstrap }
}

export enum APP_RUNNER_EVENTS {
	RUN_APP = 'RUN_APP'
}

export enum APP_RUNNER_PIPES {
	RUN_APP = 'RUN_APP'
}

export enum APP_RUNNER_ACTIONS {
	RUN_APP = 'RUN_APP'
}

export const installAppRunner = (pathToAppDir: string) =>
	pipe(
		addPipe({
			name: APP_RUNNER_PIPES.RUN_APP,
			events: [EVENTS.START_SERVER, FILE_WATCHER_EVENTS.FILE_CHANGE]
		}),
		addAction({
			name: APP_RUNNER_ACTIONS.RUN_APP,
			pipes: [APP_RUNNER_PIPES.RUN_APP],
			async run(props: { path?: string }, context) {
				const { bootstrap } = getAppBoostrap(
					path.join(pathToAppDir, '/bootstrap.ts')
				)

				console.log('Running app')
				clearRequireCache()
				const config = require(path.join(pathToAppDir, '/config.json'))
				const app = await bootstrap(config)

				context.state.app = app
			}
		})
	)
