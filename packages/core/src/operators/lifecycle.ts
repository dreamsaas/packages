import { Plugin, ServerContext } from '@dreamsaas/types'
import { pipe } from '../utils'
import { log } from './loggable'

declare module '@dreamsaas/types' {}

const runPluginSetups = () => async (
	context: ServerContext
) => {
	const plugins = context?.server?.plugins || []
	let tmpContext = context
	for (let plugin of plugins) {
		if (plugin.setup) {
			tmpContext =
				(await plugin.setup(tmpContext)) || tmpContext
		}
	}
	return tmpContext
}

const runPluginRuns = () => async (
	context: ServerContext
) => {
	const plugins = context?.server?.plugins || []
	for (let plugin of plugins) {
		if (plugin.run) {
			await plugin.run(context)
		}
	}
}

const runPluginStops = () => async (
	context: ServerContext
) => {
	const plugins = context?.server?.plugins || []
	for (let plugin of plugins) {
		if (plugin.stop) {
			await plugin.stop(context)
		}
	}
}

export const setupServer = (context: ServerContext) =>
	pipe(
		log('Setting up Server'),
		runPluginSetups(),
		log('Setup complete')
	)(context)

export const runServer = (context: ServerContext) =>
	pipe(
		log('Running Server'),
		runPluginRuns(),
		log('Run complete')
	)(context)

export const stopServer = (context: ServerContext) =>
	pipe(
		log('Starting Server'),
		runPluginStops(),
		log('Stop complete')
	)(context)
