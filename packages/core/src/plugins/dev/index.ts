import { createServer } from '../../create-server'
import {
	createService,
	onServiceRun,
	onServiceSetup,
	onServiceStop
} from '../../operators/services'
import { ServerContext, ChokidarContext } from '@dreamsaas/types'
import {
	addContext,
	requireContext,
	addToConfig,
	removeContext
} from '../../operators/context'
import { createState, pipe } from '../../utils'
import chokidar from 'chokidar'
import isWindows from 'is-windows'
import { stopServer } from '../../operators/lifecycle'
import { createHook } from 'async_hooks'
import { log } from '../../operators/loggable'
import { doIf } from '../../operators/flow-control'

declare module '@dreamsaas/types' {
	export interface Services {
		dev?: {
			watchers?: chokidar.FSWatcher[]
			server: ServerContext
			projectPath?: string
		}
	}

	export interface ChokidarContext extends ServerContext {
		chokidarPath: string
		chokidarWatcher: chokidar.FSWatcher
	}
}
const formatPathForNode = (filePath: string) => filePath.replace(/\\/g, '/')

const clearRequireCache = () => () => {
	for (let key in require.cache) {
		delete require.cache[key]
	}
}

const createChokidarWatcher = (...funcs: Function[]) =>
	pipe(
		requireContext('chokidarPath', 'createChokidarWatcher'),
		(context: ChokidarContext) => {
			const chokidarWatcher = chokidar.watch(context.chokidarPath)

			chokidarWatcher.on('all', async (eventType: string, filePath: string) => {
				//TODO can't define running state here...
				await pipe(
					addContext({
						chokidarEventType: eventType,
						chokidarFilePath: filePath
					}),
					...funcs
				)(context)
			})

			return addContext({
				chokidarWatcher
			})
		}
	)

const chokidarWatch = (...funcs: Function[]) => (context: ServerContext) =>
	pipe(
		requireContext('chokidarPath', 'chokidarWatch'),
		createChokidarWatcher(),
		(context: ChokidarContext) => {
			context.server.services.dev.watchers.push(context.chokidarWatcher)
		},
		removeContext(['chokidarPath', 'chokidarWatcher'])
	)

const stopChokidarWatchers = () => async (context: ServerContext) => {
	for (let watcher of context.server.services.dev.watchers) {
		await watcher.close()
	}
}

const stopRunningServer = () =>
	pipe(
		doIf('server.services.dev.server', 'TRUTHY'),
		async (context: ServerContext) => {
			await stopServer()(context.server.services.dev)
		}
	)

export const devServer = () =>
	createServer()(
		createService({ id: 'dev' })(
			onServiceSetup(
				addContext({
					server: {
						services: {
							dev: createState({ watcher: null, server: null, projectPath: '' })
						}
					}
				}),
				onServiceRun(
					addContext({ chokidarPath: '' }),
					chokidarWatch(
						log('chokidar Watch triggered'),
						clearRequireCache(),
						stopRunningServer()
					)
					// (context: ServerContext) => {
					// 	const formattedPath = formatPathForNode(
					// 		context.server.services.dev.projectPath
					// 	)

					// 	const watcher = chokidar.watch(formattedPath)

					// 	watcher.on('all', async (eventType: string, filePath: string) => {
					// 		clearRequireCache(filePath)

					// 		console.log('TODO: FILE WATCHER: ensure no parallel run')

					// 		const server = context.server.services.dev.server
					// 		if (server) {
					// 			await stopServer()(context)
					// 		}
					// 		await pipe()
					// 	})

					// 	context.server.services.dev.watcher = watcher
					// }
				),
				onServiceStop(stopChokidarWatchers())
			)
		)
	)
