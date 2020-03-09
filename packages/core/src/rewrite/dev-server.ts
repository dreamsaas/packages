import { addAction } from './actions'
import { createApplication, IApplication } from './application'
import {
	installFileWatcher,
	FILE_WATCHER_ACTIONS,
	FILE_WATCHER_EVENTS
} from './file-watcher'
import path from 'path'
import { triggerEvent } from './events'
import { pipe } from '../utils'
import { addPipe } from './pipes'
import { installAppRunner } from './install-app-runner'
import { installDevApi } from './install-dev-api'

export enum EVENTS {
	START_SERVER = 'START_SERVER',
	STOP_SERVER = 'STOP_SERVER',
	GET_CONFIG = 'GET_CONFIG',
	POST_CONFIG = 'POST_CONFIG',
	RUN_APP = 'RUN_APP'
}

export enum PIPES {
	START_SERVER = 'START_SERVER',
	STOP_SERVER = 'STOP_SERVER',
	GET_CONFIG = 'GET_CONFIG',
	POST_CONFIG = 'POST_CONFIG',
	RUN_APP = 'RUN_APP'
}

export enum ACTIONS {
	START_SERVER = 'START_SERVER',
	STOP_SERVER = 'STOP_SERVER',
	GET_CONFIG = 'GET_CONFIG',
	POST_CONFIG = 'POST_CONFIG',
	RUN_APP = 'RUN_APP'
}

export const bootstrapDevApp = async (pathToAppDir: string) => {
	const devApp = await createApplication(
		addAction({
			name: ACTIONS.START_SERVER,
			all: true,
			run() {
				console.log('Starting Dev Server')
			}
		}),
		addAction({
			name: ACTIONS.STOP_SERVER,
			all: true,
			run() {
				console.log('Stopping Dev Server')
			}
		}),
		installFileWatcher(pathToAppDir),
		installAppRunner(pathToAppDir),
		installDevApi(pathToAppDir),
		triggerEvent({ name: EVENTS.START_SERVER })
	)({})

	return devApp
}

bootstrapDevApp(path.join(__dirname, '/app'))
