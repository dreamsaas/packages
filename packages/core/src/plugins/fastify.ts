import {
	createPlugin,
	onPluginRun,
	onPluginCreated,
	onPluginSetup
} from '../operators/plugin'
import {
	ServerContext,
	RouteContext
} from '@dreamsaas/types'
import Fastify, { FastifyInstance } from 'fastify'
import { merge, pipe } from '../utils'
import { log } from '../operators/loggable'
import { addContext } from '../operators/context'

declare module '@dreamsaas/types' {
	export interface Config {
		fastify?: {
			routes?: any[]
		}
	}

	export interface Server {
		fastify?: FastifyInstance
	}

	export interface RouteContext extends ServerContext {
		request: Fastify.FastifyRequest
		reply: Fastify.FastifyReply<any>
	}
}

const convertRouteHandler = (handler: Function) =>
	pipe(handler)

export const addRoute = (route: Fastify.RouteOptions) => (
	context: ServerContext
) => {
	const convertedHandler = convertRouteHandler(
		route.handler
	)
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

const applyRoutes = () => (context: ServerContext) => {
	context.server.config?.fastify?.routes?.forEach(route => {
		context.server.fastify?.route({
			...route,
			async handler(request, reply) {
				return route.handler(
					merge(context, { request, reply })
				)
			}
		})
	})
}

const runFastify = () => (context: ServerContext) => {
	context.server.fastify?.listen(3000)
}

const send = (value: any) => async (
	context: RouteContext
) => {
	const isFunc = typeof value === 'function'
	if (isFunc) {
		return context.reply.send(await value(context))
	}
	return context.reply.send(value)
}

export const useFastify = createPlugin({ id: 'fastify' })(
	onPluginCreated(
		pipe(
			addContext({
				server: { config: { fastify: { routes: [] } } }
			})
		)
	),
	onPluginSetup(
		pipe(
			addRoute({
				url: '/',
				method: 'GET',
				handler: pipe(
					// validate(),
					// getModel((context:ServerContext)=>),
					send('hello world')
				)
			})
		)
	),
	onPluginRun(
		pipe(
			log('Starting Fastify'),
			applyRoutes(),
			runFastify()
		)
	)
)
