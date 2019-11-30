import { pipe, createServer } from '.'
import { setupServer, runServer } from './operators/lifecycle'
import { sendFromContext, useFastify, addRoute } from './plugins/fastify'
import request from 'supertest'

const run = async () => {
	const context = await createServer()(
		useFastify(),
		addRoute({
			url: '/',
			method: 'GET',
			handler: pipe(
				// validate(),
				// getModel((context:ServerContext)=>),
				sendFromContext('request.query')
			)
		}),
		setupServer,
		runServer
	)
	const response = await request('0.0.0.0:3000').get('/?id=1')
}
run()
// await stopServer(context)
