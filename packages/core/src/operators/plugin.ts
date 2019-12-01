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

export const usePlugins = () => addContext({ server: { plugins: [] } })

export const storePlugin = () =>
	pipe(
		requireContext('plugin', 'storePlugin'),
		addContext((context: PluginContext) => ({
			server: { plugins: [context.plugin] }
		}))
	)

export const onPluginCreated = (...funcs: Function[]) =>
	pipe(
		requireContext('plugin', 'onPluginCreated'),
		addContext({ plugin: { created: pipe(...funcs) } })
	)

export const onPluginSetup = (...funcs: Function[]) =>
	pipe(
		requireContext('plugin', 'onPluginSetup'),
		addContext({ plugin: { setup: pipe(...funcs) } })
	)

export const onPluginRun = (...funcs: Function[]) =>
	pipe(
		requireContext('plugin', 'onPluginRun'),
		addContext({ plugin: { run: pipe(...funcs) } })
	)

export const onPluginStop = (...funcs: Function[]) =>
	pipe(
		requireContext('plugin', 'onPluginStop'),
		addContext({ plugin: { stop: pipe(...funcs) } })
	)

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
