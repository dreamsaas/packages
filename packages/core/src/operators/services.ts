import { ServerContext, Service, ServiceContext } from '@dreamsaas/types'
import { pipe, merge } from '..'
import {
	addContext,
	requireContext,
	clearContext,
	removeContext
} from './context'

declare module '@dreamsaas/types' {
	export interface Service {
		id: string
		created?: (context: ServerContext) => ServerContext
		setup?: (context: ServerContext) => ServerContext
		run?: (context: ServerContext) => void
		stop?: (context: ServerContext) => void
	}

	export interface ServiceContext extends ServerContext {
		service: Service
	}

	export interface Services {}

	export interface Server {
		services?: Services
	}
}

export const useServices = () => (context: ServerContext) =>
	merge(context, { server: { services: {} } })

const storeService = () =>
	requireContext('service', 'storeService', (context: ServiceContext) =>
		merge(context, {
			server: { services: { [context.service.id]: context.service } }
		})
	)

export const onServiceCreated = (func: Function) =>
	requireContext('service', 'onServiceCreated', (context: ServiceContext) =>
		merge(context, { service: { created: func } })
	)

export const onServiceSetup = (func: Function) =>
	requireContext('service', 'onServiceSetup', (context: ServiceContext) =>
		merge(context, { service: { setup: func } })
	)

export const onServiceRun = (func: Function) =>
	requireContext('service', 'onServiceRun', (context: ServiceContext) =>
		merge(context, { service: { run: func } })
	)

export const onServiceStop = (func: Function) =>
	requireContext('service', 'onServiceStop', (context: ServiceContext) =>
		merge(context, { service: { stop: func } })
	)
export const runServiceCreated = () =>
	requireContext(
		'service',
		'runServiceCreated',
		async (context: ServiceContext) => {
			if (typeof context.service.created === 'function') {
				return await context.service.created(context)
			}
		}
	)

export const setupService = (id: string) => async (context: ServerContext) => {
	const service = context.server.services[id]
	if (!service) {
		throw new Error(`Cannot setup service ${id}. It does not exist`)
	}
	const func = service?.setup
	if (func) return await func(context)
}

export const runService = (id: string) => async (context: ServerContext) => {
	const service = context.server.services[id]
	if (!service) {
		throw new Error(`Cannot run service ${id}. It does not exist`)
	}
	const func = service?.run
	if (func) await func(context)
}

export const stopService = (id: string) => async (context: ServerContext) => {
	const service = context.server.services[id]
	if (!service) {
		throw new Error(`Cannot stop service ${id}. It does not exist`)
	}
	const func = service?.stop
	if (func) await func(context)
}

export const createService = (service: Service) => (...funcs: Function[]) => (
	context: ServerContext
) =>
	pipe(
		addContext({ service }),
		...funcs,
		storeService(),
		runServiceCreated(),
		removeContext('service')
	)(context)
