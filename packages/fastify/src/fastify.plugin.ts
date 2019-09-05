import { Plugin, Server, Service, PluginSettingsUI } from '@dreamsaas/types'
import Fastify from 'fastify'

export const hooks = {}

class FastifyService implements Service {
	id = 'fastify'
	fastify: Fastify.FastifyInstance

	async createServer() {
		console.log('creating server')
		this.fastify = Fastify({ logger: false })
	}

	async start({ port }: { port: number }) {
		console.log('starting fastify')
		this.fastify.listen(port)
	}

	async stop() {
		await this.fastify.close()
	}
}

export class FastifyPlugin implements Plugin {
	id = 'fastify'

	hooks = hooks
	FastifyService: FastifyService
	settingsUI: PluginSettingsUI = {
		components: [
			{
				name: 'FastifyRoutes',
				path: '@dreamsaas/fastify/src/components/routes-page.vue'
			}
		],
		pages: [
			{
				id: 'routes',
				path: '/routes',
				heading: 'Routes',
				component: 'FastifyRoutes'
			}
		],
		sidebar: [
			{
				text: 'Routes',
				pageId: 'routes'
			}
		]
	}

	async created(server: Server, options) {
		if (!server.config.http) {
			server.config.http = { host: '', port: 8000, routes: [] }
		}

		const fastifyService = new FastifyService()
		server.services.addService(fastifyService)

		await fastifyService.createServer()

		server.hooks.addHookAction('SERVER_PRE_START', {
			id: 'create-fastify',
			async handler(value, server: Server) {
				await fastifyService.createServer()
			}
		})

		server.hooks.addHookAction('SERVER_START', {
			id: 'start-fastify',
			async handler(value, server: Server) {
				fastifyService.start({ port: server.config.http.port || 8000 })
			}
		})

		server.hooks.addHookAction('SERVER_STOP', {
			id: 'stop-fastify',
			async handler(value, server: Server) {
				await fastifyService.stop()
			}
		})

		server.hooks.addAction({
			id: 'fastify-return-explicit-string',
			type: 'fastify-response',
			handler(value, server, options) {
				return options.value
			},
			settingsUI: [{}]
		})
	}

	async setup(server: Server, options) {
		await this.generateRoutes(server)
	}

	async generateRoutes(server: Server) {
		const fastify: Fastify.FastifyInstance = server.services.getService(
			'fastify'
		).fastify

		const routes = server.config.http.routes

		routes.forEach(route => {
			const { method, action, hooks, query, url } = route
			//Consider rethinking these
			const beforeHook = `fastify:route:pre ${url}`
			const handlerHook = `fastify:route:handler ${url}`
			const responseHook = `fastify:route:response ${url}`

			// Define hooks
			server.hooks.addHook({ id: beforeHook })
			server.hooks.addHook({ id: handlerHook })
			server.hooks.addHook({ id: responseHook })

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
