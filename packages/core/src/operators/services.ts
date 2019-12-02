import { ServerContext, Service, ServiceContext } from '@dreamsaas/types'
import { pipe, merge } from '..'
import {
	addContext,
	requireContext,
	clearContext,
	removeContext
} from './context'
import {
	generateOnSetupOperator,
	generateOnRunOperator,
	generateOnStopOperator,
	generateOnCreatedOperator
} from './lifecycle'

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

export const useServices = () => addContext({ server: { services: {} } })

const storeService = () =>
	pipe(
		requireContext('service', 'storeService'),
		addContext((context: ServiceContext) => ({
			server: { services: { [context.service.id]: context.service } }
		}))
	)

export const onServiceCreated = generateOnCreatedOperator(
	'service',
	'onServiceCreated'
)

export const onServiceSetup = generateOnSetupOperator(
	'service',
	'onServiceSetup'
)

export const onServiceRun = generateOnRunOperator('service', 'onServiceRun')

export const onServiceStop = generateOnStopOperator('service', 'onServiceStop')

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

export const createService = (service: Service) => (...funcs: Function[]) =>
	pipe(
		addContext({ service }),
		...funcs,
		storeService(),
		runServiceCreated(),
		removeContext('service')
	)
