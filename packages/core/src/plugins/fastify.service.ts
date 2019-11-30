import { ServerContext } from '@dreamsaas/types'
import Fastify, { FastifyInstance } from 'fastify'
import { createState, merge, pipe } from '..'
import { addContext } from '../operators/context'
import { log } from '../operators/loggable'
import {
	createService,
	onServiceRun,
	onServiceSetup,
	onServiceStop
} from '../operators/services'

declare module '@dreamsaas/types' {
	export interface Services {
		fastify?: { fastify?: FastifyInstance }
	}
}

const applyRoutes = () => (context: ServerContext) => {
	context.server.config?.fastify?.routes?.forEach(route => {
		context.server.services.fastify.fastify.route({
			...route,
			async handler(request, reply) {
				return await route.handler(merge(context, { request, reply }))
			}
		})
	})
}

const runFastify = () => async (context: ServerContext) => {
	await context.server.services.fastify.fastify.listen(3000, '0.0.0.0')
}

const stopFastify = () => async (context: ServerContext) => {
	await context.server.services.fastify.fastify.close()
}

const addFastifyToService = () => (context: ServerContext) => {
	const fastify = Fastify()
	return addContext({
		server: { services: { fastify: { fastify: createState(fastify) } } }
	})(context)
}

export const useFastifyService = () =>
	createService({ id: 'fastify' })(
		onServiceSetup(pipe(addFastifyToService())),
		onServiceRun(pipe(log('Starting Fastify'), applyRoutes(), runFastify())),
		onServiceStop(pipe(log('Stopping Fastify'), stopFastify()))
	)
