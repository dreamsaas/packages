import { pipe, merge, invertedPipe } from '../utils'
import { Plugin, ServerContext } from '@dreamsaas/types'
import { addContext, clearContext } from './context'

declare module '@dreamsaas/types' {
	export interface Plugin {
		id: string
		setup?: (context: ServerContext) => ServerContext
		run?: (context: ServerContext) => void
		stop?: (context: ServerContext) => void
	}

	export interface Server {
		plugins?: Plugin[]
	}
}

export const usePlugins = () => (context: ServerContext) =>
	merge(context, { server: { plugins: [] } })

export const requirePluginContext = (func: Function) => (context: any) => {
	if (!context.plugin)
		throw new Error('storePlugin must be called within plugin context.')
	return func(context)
}

export const storePlugin = () =>
	requirePluginContext((context: ServerContext & { plugin: any }) => {
		return merge(context, { server: { plugins: [context.plugin] } })
	})

export const onPluginCreated = (func: Function) =>
	requirePluginContext(async (context: any) => {
		return merge(context, { plugin: { created: func } })
	})

export const onPluginSetup = (func: Function) =>
	requirePluginContext(async (context: any) => {
		return merge(context, { plugin: { setup: func } })
	})

export const onPluginRun = (func: Function) =>
	requirePluginContext(async (context: any) => {
		return merge(context, { plugin: { run: func } })
	})

export const onPluginStop = (func: Function) =>
	requirePluginContext(async (context: any) => {
		return merge(context, { plugin: { stop: func } })
	})

export const runPluginCreated = () =>
	requirePluginContext(async (context: any) => {
		if (typeof context.plugin.created === 'function') {
			await context.plugin.created(context)
		}
	})

export const addPluginContext = (plugin: Plugin) => addContext({ plugin })

export const createPlugin = (plugin: Plugin) => (...funcs: Function[]) => (
	context: ServerContext
) =>
	pipe(
		addPluginContext(plugin),
		...funcs,
		storePlugin(),
		runPluginCreated(),
		clearContext()
	)(context)
