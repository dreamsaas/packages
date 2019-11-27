import {
	convertToServerContext,
	addContext,
	clearContext,
	fromContext,
	addFromContext
} from './context'
import { pipe } from '../utils'

describe('context', () => {
	it('should create server context', () => {
		const server = { name: 'myServer' }
		const serverContext = convertToServerContext()(server)

		expect(serverContext).toMatchObject({ server })
	})

	it('should add context', () => {
		const server = { name: 'myServer' }
		const serverContext = convertToServerContext()(server)

		const newContext = { plugin: true }
		const addedContext = addContext(newContext)(
			serverContext
		)

		expect(addedContext).toMatchObject({
			server,
			...newContext
		})
	})

	it('should clear context', () => {
		const server = { name: 'myServer' }
		const serverContext = convertToServerContext()(server)

		const newContext = { plugin: true }
		const addedContext = addContext(newContext)(
			serverContext
		)

		const clearedContext = clearContext()(addedContext)

		expect(clearedContext).toMatchObject({ server })
	})

	it('should create and add context in pipe', async () => {
		const server = { name: 'myServer' }
		const newContext = { plugin: true }
		const newContext2 = { plugin2: true }
		const context = await pipe(
			convertToServerContext(),
			addContext(newContext),
			addContext(newContext2)
		)(server)

		expect(context).toMatchObject({
			server,
			...newContext,
			...newContext2
		})
	})

	it('should clear context in pipe', async () => {
		const server = { name: 'myServer' }
		const newContext = { plugin: true }
		const newContext2 = { plugin2: true }
		const context = await pipe(
			convertToServerContext(),
			addContext(newContext),
			addContext(newContext2),
			clearContext()
		)(server)

		expect(context).toMatchObject({ server })
	})

	describe('fromContext', () => {
		it('should get value from context using function', async () => {
			const operator = (accessor: Function) =>
				pipe(fromContext(accessor))

			const context = await pipe(
				operator((context: any) => context.thing.nested)
			)({
				thing: { nested: 1 }
			})

			expect(context).toBe(1)
		})

		it('should get value from context using string accessor', async () => {
			const operator = (accessor: string) =>
				pipe(fromContext(accessor))

			const context = await pipe(operator('thing.nested'))({
				thing: { nested: 1 }
			})

			expect(context).toBe(1)
		})

		it('should get value from context using string array accessor', async () => {
			const operator = (accessor: string[]) =>
				pipe(fromContext(accessor))

			const context = await pipe(
				operator(['thing', 'nested'])
			)({
				thing: { nested: 1 }
			})

			expect(context).toBe(1)
		})

		it('should return undefined if not found', async () => {
			const operator = (accessor: string) =>
				pipe(fromContext(accessor))

			const context = await pipe(
				operator('thing.nested.fake')
			)({
				thing: { nested: 1 }
			})

			// If undefined, pipe will use previous value
			expect(context).toMatchObject({
				thing: { nested: 1 }
			})
		})
	})

	describe('addFromContext', () => {
		it('should add to context from context', async () => {
			const obj = {
				thing: { nested: 1 }
			}
			const context = await pipe(
				addFromContext('thing.nested', 'nested')
			)(obj)
			expect(context).toMatchObject({ ...obj, nested: 1 })
		})

		it('should use last key if none provided', async () => {
			const obj = {
				thing: { nested: 1 }
			}
			const context = await pipe(
				addFromContext('thing.nested')
			)(obj)
			expect(context).toMatchObject({ ...obj, nested: 1 })
		})

		it('should allow using function accessor', async () => {
			const obj = {
				thing: { nested: 1 }
			}
			const context = await pipe(
				addFromContext((context: any) => {
					return context.thing.nested
				}, 'nested')
			)(obj)
			expect(context).toMatchObject({ ...obj, nested: 1 })
		})

		it('should require key if using function accessor', async () => {
			const obj = {
				thing: { nested: 1 }
			}
			expect(
				pipe(
					addFromContext((context: any) => {
						return context.thing.nested
					})
				)(obj)
			).rejects.toThrow()
		})
	})
})
