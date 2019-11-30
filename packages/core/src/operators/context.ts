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

export const requireContext = (
	requiredContextKeys: string | string[],
	operatorName: string,
	func: Function
) => (context: any) => {
	const keys = Array.isArray(requiredContextKeys)
		? requiredContextKeys
		: [requiredContextKeys]

	const missing = keys.filter(key => {
		if (typeof context[key] === undefined) return true
		return false
	})

	if (missing.length > 0) {
		throw new Error(
			`${operatorName} must be called with the following context ${missing.join(
				',  '
			)}.`
		)
	}

	return func(context)
}

export const addContext = (newContext: {}) => (currentContext: ServerContext) =>
	merge(currentContext, newContext)

export const removeContext = (key: string | string[]) => (
	currentContext: ServerContext
) => {
	const newContext = clone(currentContext)
	let keys = Array.isArray(key) ? key : [key]
	keys.forEach(curKey => {
		delete newContext[curKey]
	})

	return newContext
}

export const clearContext = () => ({ server }: ServerContext) =>
	clone({ server })

export const fromContext = (accessor: Function | string | string[]) => (
	context: ServerContext
) => {
	if (typeof accessor === 'function') return accessor(context)

	return stringAccessor(accessor, context)
}

export const addFromContext = (
	accessor: Function | string | string[],
	key?: string
) => (context: ServerContext) => {
	let stringAccessor: string[] = []

	if (typeof accessor !== 'function') {
		stringAccessor = Array.isArray(accessor) ? accessor : accessor.split('.')
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
	const usedKey = key ?? stringAccessor[stringAccessor.length - 1]
	return addContext({
		[usedKey]: fromContext(accessor)(context)
	})(context)
}
