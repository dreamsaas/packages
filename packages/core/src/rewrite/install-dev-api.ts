import { EVENTS } from './dev-server'
import { FILE_WATCHER_EVENTS } from './file-watcher'
import { pipe } from '../utils'
import { addPipe, runApplicationPipe } from './pipes'
import { addAction } from './actions'
import { IApplication, changeState } from './application'
import path from 'path'
import Fastify from 'fastify'
import { triggerEvent } from './events'
import fs from 'fs'
import fastifyCors from 'fastify-cors'

export enum DEV_API_EVENTS {
	REQUEST_APP = 'REQUEST_APP',
	POST_APP_CONFIG = 'POST_APP_CONFIG'
}

export enum DEV_API_PIPES {
	START_DEV_API = 'START_DEV_API',
	REQUEST_APP = 'REQUEST_APP',
	POST_APP_CONFIG = 'POST_APP_CONFIG'
}

export enum DEV_API_ACTIONS {
	START_DEV_API = 'START_DEV_API',
	REQUEST_APP = 'REQUEST_APP',
	POST_APP_CONFIG = 'POST_APP_CONFIG'
}

export const installDevApi = (pathToAppDir: string) =>
	pipe(
		addPipe({
			name: DEV_API_PIPES.START_DEV_API,
			events: [EVENTS.START_SERVER]
		}),
		addPipe({
			name: DEV_API_PIPES.REQUEST_APP
		}),
		addPipe({
			name: DEV_API_PIPES.POST_APP_CONFIG
		}),
		addAction({
			name: DEV_API_ACTIONS.REQUEST_APP,
			pipes: [DEV_API_PIPES.REQUEST_APP],
			run(props, context) {
				console.log('entered action')
				const app: IApplication = context.state.app

				return app
			}
		}),
		addAction({
			name: DEV_API_ACTIONS.POST_APP_CONFIG,
			pipes: [DEV_API_PIPES.POST_APP_CONFIG],
			async run(props: { request: Fastify.FastifyRequest }, context) {
				await new Promise(r =>
					fs.copyFile(
						path.join(pathToAppDir, 'config.json'),
						path.join(pathToAppDir, `config-rev-${new Date()}.json`),
						e => r()
					)
				)

				return new Promise(r =>
					fs.writeFile(
						path.join(pathToAppDir, 'config.json'),
						JSON.stringify(props.request.body, null, 4),
						e => r('ok')
					)
				)
			}
		}),
		addAction({
			name: DEV_API_ACTIONS.START_DEV_API,
			pipes: [DEV_API_PIPES.START_DEV_API],
			async run(props, context) {
				const server = Fastify()
				server.register(fastifyCors, {
					origin: true
				})

				server.get('/api/app', async (request, reply) => {
					console.log('entered route')
					return await runApplicationPipe({ name: DEV_API_PIPES.REQUEST_APP })(
						context
					)
				})

				server.post('/api/app', (request, reply) =>
					runApplicationPipe({
						name: DEV_API_PIPES.POST_APP_CONFIG,
						props: { request }
					})(context)
				)

				await server.listen(3001)
				console.log('fastify listening on 3001')
			}
		})
	)
