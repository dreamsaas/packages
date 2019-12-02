import { pipe, merge, invertedPipe } from '../utils'
import { Plugin, ServerContext, PluginContext } from '@dreamsaas/types'
import { addContext, removeContext, requireContext } from './context'
import {
	generateOnSetupOperator,
	generateOnRunOperator,
	generateOnStopOperator,
	generateOnCreatedOperator
} from './lifecycle'

declare module '@dreamsaas/types' {
	export interface Plugin {
		id: string
		created?: (context: ServerContext) => ServerContext
		setup?: (context: ServerContext) => ServerContext
		run?: (context: ServerContext) => void
		stop?: (context: ServerContext) => void
	}

	export interface PluginContext extends ServerContext {
		plugin: Plugin
	}

	export interface Server {
		plugins?: Plugin[]
	}
}

export const usePlugins = () => addContext({ server: { plugins: [] } })

export const storePlugin = () =>
	pipe(
		requireContext('plugin', 'storePlugin'),
		addContext((context: PluginContext) => ({
			server: { plugins: [context.plugin] }
		}))
	)

export const onPluginCreated = generateOnCreatedOperator(
	'plugin',
	'onPluginCreated'
)

export const onPluginSetup = generateOnSetupOperator('plugin', 'onPluginSetup')

export const onPluginRun = generateOnRunOperator('plugin', 'onPluginRun')

export const onPluginStop = generateOnStopOperator('plugin', 'onPluginStop')

export const runPluginCreated = () =>
	pipe(
		requireContext('plugin', 'runPluginCreated'),
		async (context: PluginContext) => {
			if (typeof context.plugin.created === 'function') {
				return await context.plugin.created(context)
			}
		}
	)

export const createPlugin = (plugin: Plugin) => (...funcs: Function[]) =>
	pipe(
		addContext({ plugin }),
		...funcs,
		storePlugin(),
		runPluginCreated(),
		removeContext('plugin')
	)
