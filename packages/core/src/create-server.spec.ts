import { createServer } from './create-server'
import { Server } from '@dreamsaas/types'
import { pipe } from './utils'

describe('core', () => {
	describe('createServer', () => {
		it('should initialize without props', async () => {
			const server = await createServer()()

			expect(server).toMatchObject({ server: {} })
		})

		it('should initialize with initializer', async () => {
			const init = { key: 'value' }
			const server = await createServer(init)()

			expect(server).toMatchObject({ server: init })
		})

		it('should run chainable function', async () => {
			const init = { key: 'value' }
			const newField = { chained: 'chained' }
			const server = await createServer(init)(
				(server: Server) => ({
					...server,
					...newField
				})
			)

			expect(server).toMatchObject({
				server: init,
				...newField
			})
		})

		it('should await chained operators', async () => {
			const init = { key: 'value' }
			const newField = { chained: 'chained' }

			const chainable = async (server: Server) => {
				await new Promise(r => setTimeout(r, 1))
				return { ...server, ...newField }
			}

			const server = await createServer(init)(chainable)

			expect(server).toMatchObject({
				server: init,
				...newField
			})
		})
	})

	it('should', async () => {})
})
