import { RouteContext, ServerContext } from '@dreamsaas/types'
import Fastify from 'fastify'
import { addToConfig, fromContext } from '../operators/context'
import {
	createPlugin,
	onPluginCreated,
	onPluginRun,
	onPluginSetup,
	onPluginStop
} from '../operators/plugin'
import { runService, setupService, stopService } from '../operators/services'
import { merge, pipe } from '../utils'
import { useFastifyService } from './fastify.service'

declare module '@dreamsaas/types' {
	export interface Config {
		fastify?: {
			routes?: any[]
		}
	}

	export interface RouteContext extends ServerContext {
		request: Fastify.FastifyRequest
		reply: Fastify.FastifyReply<any>
	}
}

const convertRouteHandler = (handler: Function) => pipe(handler)

export const sendFromContext = (accessor: any) => async (
	context: RouteContext
) => {
	const value = await fromContext(accessor)(context)

	return context.reply.send(value)
}

export const addRoute = (route: Fastify.RouteOptions) => (
	context: ServerContext
) => {
	const convertedHandler = convertRouteHandler(route.handler)
	return merge(context, {
		server: {
			config: {
				fastify: {
					routes: [{ ...route, handler: convertedHandler }]
				}
			}
		}
	})
}

export const useFastify = () =>
	createPlugin({ id: 'fastify' })(
		onPluginCreated(
			addToConfig({ fastify: { routes: [] } }),
			useFastifyService()
		),
		onPluginSetup(setupService('fastify')),
		onPluginRun(runService('fastify')),
		onPluginStop(stopService('fastify'))
	)
