import { pipe } from '../utils'
import { addPipe } from './pipes'
import { addAction } from './actions'
import { addEvent, triggerEvent } from './events'
import { PIPES, EVENTS } from './dev-server'
import chokidar from 'chokidar'

export enum FILE_WATCHER_EVENTS {
	FILE_CHANGE = 'FILE_CHANGE'
}

export enum FILE_WATCHER_PIPES {
	START_FILE_WATCHER = 'START_FILE_WATCHER',
	STOP_FILE_WATCHER = 'STOP_FILE_WATCHER',
	FILE_CHANGE = 'FILE_CHANGE'
}

export enum FILE_WATCHER_ACTIONS {
	START_FILE_WATCHER = 'START_FILE_WATCHER',
	STOP_FILE_WATCHER = 'STOP_FILE_WATCHER',

	FILE_CHANGE = 'FILE_CHANGE'
}

let watcher: chokidar.FSWatcher = null

export const installFileWatcher = (watchPath: string) =>
	pipe(
		addAction({
			name: FILE_WATCHER_ACTIONS.FILE_CHANGE,
			all: true,
			run(props: { path: string }, context) {
				console.log('file changed', props.path)
			}
		}),
		addPipe({
			name: FILE_WATCHER_PIPES.START_FILE_WATCHER,
			events: [EVENTS.START_SERVER]
		}),
		addAction({
			name: FILE_WATCHER_ACTIONS.START_FILE_WATCHER,
			pipes: [FILE_WATCHER_PIPES.START_FILE_WATCHER],
			run(props, context) {
				watcher = chokidar.watch(watchPath, {
					persistent: true,
					ignoreInitial: true
				})

				let timeout: NodeJS.Timeout
				const changeHandler = msg => (path, event) => {
					if (timeout) clearTimeout(timeout)
					timeout = setTimeout(() => {
						triggerEvent({
							name: FILE_WATCHER_EVENTS.FILE_CHANGE,
							props: { event, path }
						})(context)
					}, 1000)
				}
				return new Promise(r => {
					watcher
						.on('add', changeHandler('add'))
						.on('change', changeHandler('change'))
						.on('unlink', changeHandler('unlink'))
					watcher.on('ready', () => {
						console.log('watcher ready')
						r()
					})
				})
			}
		}),
		addPipe({
			name: FILE_WATCHER_PIPES.STOP_FILE_WATCHER,
			events: [EVENTS.STOP_SERVER]
		}),
		addAction({
			name: FILE_WATCHER_ACTIONS.STOP_FILE_WATCHER,
			pipes: [FILE_WATCHER_PIPES.STOP_FILE_WATCHER],
			async run(props, context) {
				console.log('Stopping file watcher')
				await watcher.close()
				watcher = null
			}
		})
	)
