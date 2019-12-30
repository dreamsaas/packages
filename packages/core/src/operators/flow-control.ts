import {
	requireContext,
	fromContext,
	addContext,
	removeContext
} from './context'
import { pipe } from '../utils'
import { ServerContext } from '@dreamsaas/types'

enum Conditional {
	GT = 'GT',
	LT = 'LT',
	EQ = 'EQ',
	NEQ = 'NEQ',
	GTE = 'GTE',
	LTE = 'LTE',
	TRUTHY = 'TRUTHY',
	FALSEY = 'FALSEY',
	IS_DEFINED = 'IS_DEFINED',
	IS_UNDEFINED = 'IS_UNDEFINED',
	MATCHES_OBJECT = 'MATCHES_OBJECT'
}

const checkCondition = (
	value: any,
	conditional: Conditional | keyof typeof Conditional,
	target?: any
) => {
	switch (conditional) {
		case Conditional.GT:
			return value > target
		case Conditional.LT:
			return value < target
		case Conditional.EQ:
			return value === target
		case Conditional.NEQ:
			return value !== target
		case Conditional.GTE:
			return value >= target
		case Conditional.LTE:
			return value <= target
		case Conditional.TRUTHY:
			return !!value
		case Conditional.FALSEY:
			return !value
		case Conditional.IS_DEFINED:
			return typeof value !== 'undefined'
		case Conditional.IS_UNDEFINED:
			return typeof value === 'undefined'
		case Conditional.MATCHES_OBJECT:
			try {
				expect(value).toMatchObject(target)
				return true
			} catch (e) {
				return false
			}
		default:
			throw new Error(`Unexpected conditional ${conditional}`)
	}
}

export const doIf = (
	accessor: string | string[] | Function,
	condition: Conditional | keyof typeof Conditional,
	targetAccessor?: string | string[] | Function
) => (...funcs: Function[]) => (context: ServerContext) => {
	const value = fromContext(accessor)(context)
	const target =
		typeof targetAccessor !== 'undefined'
			? fromContext(targetAccessor)(context)
			: targetAccessor
	const passesCheck = checkCondition(value, condition, target)

	if (passesCheck) return pipe(...funcs)(context)

	return context
}

export const doFor = (
	listAccessor: string,
	itemKey: string = 'value',
	key: string = 'key'
) => (...funcs: Function[]) =>
	pipe(requireContext(listAccessor, 'doFor'), async (context: any) => {
		const value: any = fromContext(listAccessor)(context)
		const isArray = Array.isArray(value)
		const isIterableObject = typeof value === 'object' && value !== null

		if (!isArray && !isIterableObject)
			throw new Error(
				`doFor error: cannot iterate over ${listAccessor} ${value} ${typeof value}`
			)

		if (isArray) {
			let tmpValue = context

			for (const [i, item] of value.entries()) {
				tmpValue = await pipe(
					addContext({ [itemKey]: item, [key]: i }),
					...funcs,
					removeContext([itemKey, key])
				)(tmpValue)
			}
			return tmpValue
		}
		// if iterable but not array
		let tmpValue = context

		for (const iterKey in value) {
			tmpValue = await pipe(
				addContext({ [itemKey]: value[iterKey], [key]: iterKey }),
				...funcs,
				removeContext([itemKey, key])
			)(tmpValue)
		}
		return tmpValue
	})
