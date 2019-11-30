import request from 'supertest'
import { pipe } from '..'
import { createServer } from '../create-server'
import { fromContext } from '../operators/context'
import { runServer, setupServer, stopServer } from '../operators/lifecycle'
import { addRoute, useFastify } from './fastify'

describe('fastify plugin', () => {
	let context: any
	it('should add route', async () => {
		context = await createServer()(
			useFastify(),
			addRoute({
				url: '/',
				method: 'GET',
				handler: pipe(fromContext((context: any) => context.request.query))
			}),
			setupServer(),
			runServer()
		)
		const response = await request('localhost:3000').get('/?id=1')
		await stopServer()(context)
		expect(response.body).toMatchObject({ id: '1' })
	})
})
