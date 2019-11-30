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
	pipe(
		requireContext('service', 'storeService'),
		addContext((context: ServiceContext) => ({
			server: { services: { [context.service.id]: context.service } }
		}))
	)

export const onServiceCreated = (...funcs: Function[]) =>
	pipe(
		requireContext('service', 'onServiceCreated'),
		addContext({ service: { created: pipe(...funcs) } })
	)

export const onServiceSetup = (...funcs: Function[]) =>
	pipe(
		requireContext('service', 'onServiceSetup'),
		addContext({ service: { setup: pipe(...funcs) } })
	)

export const onServiceRun = (...funcs: Function[]) =>
	pipe(
		requireContext('service', 'onServiceRun'),
		addContext({ service: { run: pipe(...funcs) } })
	)

export const onServiceStop = (...funcs: Function[]) =>
	pipe(
		requireContext('service', 'onServiceStop'),
		addContext({ service: { stop: pipe(...funcs) } })
	)

export const runServiceCreated = () =>
	pipe(
		requireContext('service', 'runServiceCreated'),
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
