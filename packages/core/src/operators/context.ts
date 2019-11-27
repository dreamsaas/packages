import { ServerContext } from '@dreamsaas/types'
import { merge, clone, stringAccessor } from '../utils'

declare module '@dreamsaas/types' {
	export interface ServerContext {
		server: Server
	}
}

export const convertToServerContext = () => (server: {}): ServerContext => ({
	server
})

export const addContext = (newContext: {}) => (
	currentContext: ServerContext
) => merge(currentContext, newContext)

export const clearContext = () => ({
	server
}: ServerContext) => clone({ server })

export const fromContext = (
	accessor: Function | string | string[]
) => (context: ServerContext) => {
	if (typeof accessor === 'function')
		return accessor(context)

	return stringAccessor(accessor, context)
}

export const addFromContext = (
	accessor: Function | string | string[],
	key?: string
) => (context: ServerContext) => {
	let stringAccessor: string[] = []

	if (typeof accessor !== 'function') {
		stringAccessor = Array.isArray(accessor)
			? accessor
			: accessor.split('.')
		if (
			stringAccessor.length === 0 ||
			!stringAccessor[stringAccessor.length - 1]
		) {
			throw new Error(
				`addFromContext error: string accessor must contain valid values ${stringAccessor}`
			)
		}
	} else {
		if (!key)
			throw new Error(
				'addFromContext error: key must be provided if using a function accessor'
			)
	}
	const usedKey =
		key ?? stringAccessor[stringAccessor.length - 1]
	return addContext({
		[usedKey]: fromContext(accessor)(context)
	})(context)
}
