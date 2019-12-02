import { Plugin, ServerContext } from '@dreamsaas/types'
import { pipe } from '../utils'
import { log } from './loggable'
import { addContext, requireContext } from './context'

declare module '@dreamsaas/types' {}

const addLifecycleHook = (hookName: string) => (
	contextTarget: string,
	operatorName: string
) => (...funcs: Function[]) =>
	pipe(
		requireContext(contextTarget, operatorName),
		addContext({ [contextTarget]: { [hookName]: pipe(...funcs) } })
	)

export const generateOnCreatedOperator = addLifecycleHook('created')

export const generateOnSetupOperator = addLifecycleHook('setup')

export const generateOnRunOperator = addLifecycleHook('run')

export const generateOnStopOperator = addLifecycleHook('stop')

const runPluginSetups = () => async (context: ServerContext) => {
	const plugins = context?.server?.plugins || []
	let tmpContext = context
	for (let plugin of plugins) {
		if (plugin.setup) {
			tmpContext = (await plugin.setup(tmpContext)) || tmpContext
		}
	}
	return tmpContext
}

const runPluginRuns = () => async (context: ServerContext) => {
	const plugins = context?.server?.plugins || []
	for (let plugin of plugins) {
		if (plugin.run) {
			await plugin.run(context)
		}
	}
}

const runPluginStops = () => async (context: ServerContext) => {
	const plugins = context?.server?.plugins || []
	for (let plugin of plugins) {
		if (plugin.stop) {
			await plugin.stop(context)
		}
	}
}

export const setupServer = () => async (context: ServerContext) =>
	await pipe(
		log('Setting up Server'),
		runPluginSetups(),
		log('Setup complete')
	)(context)

export const runServer = () => async (context: ServerContext) =>
	await pipe(
		log('Running Server'),
		runPluginRuns(),
		log('Run complete')
	)(context)

export const stopServer = () => async (context: ServerContext) =>
	await pipe(
		log('Starting Server'),
		runPluginStops(),
		log('Stop complete')
	)(context)
