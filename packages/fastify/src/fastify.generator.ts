import * as Fastify from 'fastify'
import { HttpServerConfig, Server } from '@dreamsaas/core'

export const fastifyRouteGenerator = (
	config: HttpServerConfig,
	fastify: Fastify.FastifyInstance,
	server?: Server
) => {
	config.routes.forEach(({ method, url, hooks }) => {
		const beforeHook = `fastify:route:pre ${url}`
		const handlerHook = `fastify:route:handler ${url}`
		const responseHook = `fastify:route:response ${url}`

		// Define hooks
		server.hooks.addHook({ id: beforeHook, actions: hooks && hooks.pre })
		server.hooks.addHook({ id: handlerHook, actions: hooks && hooks.handler })
		server.hooks.addHook({
			id: responseHook,
			actions: hooks && hooks.response
		})

		fastify.route({
			method,
			url,
			handler: async (request, reply) => {
				const preReqest = await server.hooks.runHook(beforeHook, request)
				const handler = await server.hooks.runHook(handlerHook, preReqest)
				const response = await server.hooks.runHook(responseHook, handler)
				return response
			}
		})
	})
}

export const fastifyGenerator = (config: HttpServerConfig, server?: Server) => {
	const fastifyServer = Fastify({ logger: false })

	fastifyRouteGenerator(config, fastifyServer, server)

	return {
		name: 'fastify',
		server: fastifyServer,
		async listen(port) {
			await fastifyServer.listen(port)
		}
	}
}
