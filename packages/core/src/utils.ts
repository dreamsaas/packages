import { mergeWith, cloneDeepWith } from 'lodash'

/** Unary Function */
export interface UF<T, R> {
	(source: T): R
}

export interface UFR<T, R> {
	(source: T): { [P in keyof R]: R[P] }
}

// // prettier-ignore
// export function pipe<T, A>(fn1: UF<T, A>): UFR<T,A>;
// // prettier-ignore
// export function pipe<T, A, B>(fn1: UF<T, A>, fn2: UF<A, B>): UFR<T,B>;
// // prettier-ignore
// export function pipe<T, A, B, C>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>): UF<T, C>;
// // prettier-ignore
// export function pipe<T, A, B, C, D>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>): UF<T, D>;
// // prettier-ignore
// export function pipe<T, A, B, C, D, E>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>, fn5: UF<D, E>): UF<T, E>;
// // prettier-ignore
// export function pipe<T, A, B, C, D, E, F>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>, fn5: UF<D, E>, fn6: UF<E, F>): UF<T, F>;
// // prettier-ignore
// export function pipe<T, A, B, C, D, E, F, G>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>, fn5: UF<D, E>, fn6: UF<E, F>, fn7: UF<F, G>): UF<T, G>;
// // prettier-ignore
// export function pipe<T, A, B, C, D, E, F, G, H>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>, fn5: UF<D, E>, fn6: UF<E, F>, fn7: UF<F, G>, fn8: UF<G, H>): UF<T, H>;
// // prettier-ignore
// export function pipe<T, A, B, C, D, E, F, G, H, I>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>, fn5: UF<D, E>, fn6: UF<E, F>, fn7: UF<F, G>, fn8: UF<G, H>, fn9: UF<H, I>): UF<T, I>;
// // prettier-ignore
// export function pipe<T, A, B, C, D, E, F, G, H, I,J>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>, fn5: UF<D, E>, fn6: UF<E, F>, fn7: UF<F, G>, fn8: UF<G, H>, fn9: UF<H, I>,fn10: UF<I, J>): UF<T, J>;
// // prettier-ignore
// export function pipe<T, A, B, C, D, E, F, G, H, I, J>(fn1: UF<T, A>, fn2: UF<A, B>, fn3: UF<B, C>, fn4: UF<C, D>, fn5: UF<D, E>, fn6: UF<E, F>, fn7: UF<F, G>, fn8: UF<G, H>, fn9: UF<H, I>,fn10: UF<I, J>, ...fns: UF<any, any>[]): UF<T, {}>;
/* tslint:enable:max-line-length */
export function pipe(...funcs: Function[]) {
	return async (value: any) => {
		// await value in case it's a promise
		// This happens when a pipe is passed in
		let tmpValue = await value
		for (let func of funcs) {
			const result = await func(tmpValue)
			tmpValue = result !== undefined ? result : tmpValue
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
