import { pipe } from '../utils'
import { addContext } from './context'
import { doFor, doIf } from './flow-control'

describe('flow control', () => {
	describe('doFor', () => {
		it('should iter array', async () => {
			const context: any = await pipe(
				doFor('list')(
					addContext((context: any) => {
						return { count: context.count + context.value }
					})
				)
			)({ count: 0, list: [1, 2, 3] })
			expect(context.count).toBe(6)
		})

		it('should iter object', async () => {
			const context: any = await pipe(
				doFor('list')(
					addContext((context: any) => {
						return { count: context.count + context.value, keys: [context.key] }
					})
				)
			)({ count: 0, list: { a: 1, b: 2, c: 3 } })
			expect(context.count).toBe(6)
			expect(context.keys).toMatchObject(['a', 'b', 'c'])
		})

		it('should throw if not iterable', async () => {})
	})
	describe('doIf', () => {
		describe('GT', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'GT', 'target')(addContext({ done: true }))
				)({ value: 2, target: 1 })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'GT', 'target')(addContext({ done: true }))
				)({ value: 1, target: 2 })

				expect(context.done).toBeUndefined()
			})
		})

		describe('LT', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'LT', 'target')(addContext({ done: true }))
				)({ value: 1, target: 2 })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'LT', 'target')(addContext({ done: true }))
				)({ value: 2, target: 1 })

				expect(context.done).toBeUndefined()
			})
		})

		describe('EQ', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'EQ', 'target')(addContext({ done: true }))
				)({ value: true, target: true })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'EQ', 'target')(addContext({ done: true }))
				)({ value: true, target: false })

				expect(context.done).toBeUndefined()
			})
		})

		describe('NEQ', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'NEQ', 'target')(addContext({ done: true }))
				)({ value: true, target: false })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'NEQ', 'target')(addContext({ done: true }))
				)({ value: true, target: true })

				expect(context.done).toBeUndefined()
			})
		})

		describe('GTE', () => {
			it('should pass GT', async () => {
				const context: any = await pipe(
					doIf('value', 'GTE', 'target')(addContext({ done: true }))
				)({ value: 2, target: 1 })

				expect(context.done).toBe(true)
			})

			it('should pass EQ', async () => {
				const context: any = await pipe(
					doIf('value', 'GTE', 'target')(addContext({ done: true }))
				)({ value: 1, target: 1 })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'GTE', 'target')(addContext({ done: true }))
				)({ value: 1, target: 2 })

				expect(context.done).toBeUndefined()
			})
		})

		describe('LTE', () => {
			it('should pass LT', async () => {
				const context: any = await pipe(
					doIf('value', 'LTE', 'target')(addContext({ done: true }))
				)({ value: 1, target: 2 })

				expect(context.done).toBe(true)
			})

			it('should pass EQ', async () => {
				const context: any = await pipe(
					doIf('value', 'LTE', 'target')(addContext({ done: true }))
				)({ value: 1, target: 1 })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'LTE', 'target')(addContext({ done: true }))
				)({ value: 2, target: 1 })

				expect(context.done).toBeUndefined()
			})
		})

		describe('Truthy', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'TRUTHY')(addContext({ done: true }))
				)({ value: 'yes' })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'TRUTHY')(addContext({ done: true }))
				)({ value: null })

				expect(context.done).toBeUndefined()
			})
		})

		describe('Falsey', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'FALSEY')(addContext({ done: true }))
				)({ value: undefined })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'FALSEY')(addContext({ done: true }))
				)({ value: 4 })

				expect(context.done).toBeUndefined()
			})
		})

		describe('IS_DEFINED', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'IS_DEFINED')(addContext({ done: true }))
				)({ value: null })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'IS_DEFINED')(addContext({ done: true }))
				)({ value: undefined })

				expect(context.done).toBeUndefined()
			})
		})

		describe('IS_UNDEFINED', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'IS_UNDEFINED')(addContext({ done: true }))
				)({ value: undefined })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'IS_UNDEFINED')(addContext({ done: true }))
				)({ value: false })

				expect(context.done).toBeUndefined()
			})
		})

		describe('Matches object', () => {
			it('should pass', async () => {
				const context: any = await pipe(
					doIf('value', 'MATCHES_OBJECT', 'target')(addContext({ done: true }))
				)({ value: { key: 'value' }, target: { key: 'value' } })

				expect(context.done).toBe(true)
			})

			it('should fail', async () => {
				const context: any = await pipe(
					doIf('value', 'MATCHES_OBJECT', 'target')(addContext({ done: true }))
				)({ value: { key: 'value' }, target: { key: 'value2' } })

				expect(context.done).toBeUndefined()
			})
		})

		it('should throw if bad conditional', async () => {
			expect(
				pipe(
					//@ts-ignore
					doIf('value', 'fake', 'target')(addContext({ done: true }))
				)({ value: { key: 'value' }, target: { key: 'value' } })
			).rejects.toBeInstanceOf(Error)
		})
	})
	describe('doWhile', () => {})
	describe('doCase', () => {})
})
