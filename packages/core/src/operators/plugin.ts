import { pipe, merge, invertedPipe } from '../utils'
import { Plugin, ServerContext, PluginContext } from '@dreamsaas/types'
import { addContext, removeContext, requireContext } from './context'

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

export const usePlugins = () => (context: ServerContext) =>
	merge(context, { server: { plugins: [] } })

export const storePlugin = () =>
	requireContext('service', 'onServiceSetup', (context: PluginContext) =>
		merge(context, { server: { plugins: [context.plugin] } })
	)

export const onPluginCreated = (...funcs: Function[]) =>
	requireContext('plugin', 'onPluginCreated', (context: PluginContext) =>
		merge(context, { plugin: { created: pipe(...funcs) } })
	)

export const onPluginSetup = (...funcs: Function[]) =>
	requireContext('plugin', 'onPluginSetup', (context: PluginContext) =>
		merge(context, { plugin: { setup: pipe(...funcs) } })
	)

export const onPluginRun = (...funcs: Function[]) =>
	requireContext('plugin', 'onPluginRun', (context: PluginContext) =>
		merge(context, { plugin: { run: pipe(...funcs) } })
	)

export const onPluginStop = (...funcs: Function[]) =>
	requireContext('plugin', 'onPluginStop', (context: PluginContext) =>
		merge(context, { plugin: { stop: pipe(...funcs) } })
	)

export const runPluginCreated = () =>
	requireContext(
		'plugin',
		'runPluginCreated',
		async (context: PluginContext) => {
			if (typeof context.plugin.created === 'function') {
				return await context.plugin.created(context)
			}
		}
	)

export const createPlugin = (plugin: Plugin) => (...funcs: Function[]) => (
	context: ServerContext
) =>
	pipe(
		addContext({ plugin }),
		...funcs,
		storePlugin(),
		runPluginCreated(),
		removeContext('plugin')
	)(context)
