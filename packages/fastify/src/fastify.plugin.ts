import { Plugin, Server, Service } from '@dreamsaas/types'
import * as Fastify from 'fastify'

export const hooks = {}

class FastifyService implements Service {
	id = 'fastify'
	fastify: Fastify.FastifyInstance

	async createServer() {
		this.fastify = Fastify({ logger: false })
	}

	async start({ port }: { port: number }) {
		await this.fastify.listen(port)
	}

	async stop() {
		await this.fastify.close()
	}
}

export class FastifyPlugin implements Plugin {
	id = 'fastify'

	hooks = hooks
	FastifyService: FastifyService

	async created(server: Server, options) {
		const fastifyService = new FastifyService()
		server.services.addService(fastifyService)

		server.hooks.addHookAction('SERVER_PRE_START', {
			id: 'start-fastify',
			async handler(value, server: Server) {
				await fastifyService.createServer()
			}
		})

		server.hooks.addHookAction('SERVER_START', {
			id: 'start-fastify',
			async handler(value, server: Server) {
				await fastifyService.start({ port: server.config.http.port || 8000 })
			}
		})

		server.hooks.addHookAction('SERVER_STOP', {
			id: 'stop-fastify',
			async handler(value, server: Server) {
				await fastifyService.stop()
			}
		})
	}

	async setup(server: Server, options) {
		await this.generateRoutes(server)
	}

	async generateRoutes(server: Server) {
		const fastify = this.FastifyService.fastify
		const routes = server.config.http.routes
		routes.forEach(route => {
			const { method, action, hooks, query, url } = route
			//Consider rethinking these
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
					//Totally rethink this shit
					const preReqest = await server.hooks.runHook(beforeHook, {
						request,
						data: {}
					})
					const handler = await server.hooks.runHook(handlerHook, {
						request,
						data: preReqest
					})
					const { data } = await server.hooks.runHook(responseHook, {
						request,
						data: handler,
						reply
					})
					return data
				}
			})
		})
	}
}
