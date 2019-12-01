import { mergeWith, cloneDeepWith } from 'lodash'

export const pipe = (...funcs: Function[]) => {
	return async <T>(context: T) => {
		// await value in case it's a promise
		// This happens when a pipe is passed in
		let tmpValue = await context
		for (let func of funcs) {
			if (typeof func === 'function') {
				const result = await func(tmpValue)
				tmpValue = result !== undefined ? result : tmpValue
			} else {
				throw new Error(`pipe can only use functions. recieved: ${func}`)
			}
		}
		return tmpValue
	}
}

export const invertedPipe = (value?: any) => {
	return (...funcs: Function[]) => {
		return pipe(...funcs)(value)
	}
}

enum OBJECT_TYPES {
	STATE = 'STATE'
}

export const createState = <T>(payload: T): T =>
	Object.defineProperty(payload, '_type', {
		enumerable: false,
		value: OBJECT_TYPES.STATE
	})

export const merge = <T, M>(src: T, obj: M): T & M =>
	mergeWith<T, M>(clone(src), clone(obj), (src, obj) => {
		if (
			typeof src === 'object' &&
			src !== null &&
			src._type === OBJECT_TYPES.STATE
		)
			return src
		if (
			typeof obj === 'object' &&
			obj !== null &&
			obj._type === OBJECT_TYPES.STATE
		)
			return obj
		if (Array.isArray(src) && Array.isArray(obj)) return clone([...src, ...obj])
	})

export const isStateful = (value: any) =>
	typeof value === 'object' &&
	value !== null &&
	value._type === OBJECT_TYPES.STATE

export const isClonable = (value: any) =>
	!isStateful(value) && typeof value !== 'function'

export const clone = <T>(src: T): T =>
	cloneDeepWith<T>(src, value => {
		if (!isClonable(value)) {
			return value
		}
	})

export const stringAccessor = (accessor: string | string[], obj: {}) => {
	const properties = Array.isArray(accessor) ? accessor : accessor.split('.')

	return properties.reduce((prev: any, curr: string) => prev && prev[curr], obj)
}
