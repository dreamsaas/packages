import { Server } from '@dreamsaas/types'
import * as fs from 'fs'
import * as path from 'path'
import { UIService } from '../../../ui.service'
import {
	getProjectLocation,
	getServerRunner,
	watchFiles
} from '../project-manager'
import { pubsub, PUBSUB_HOOKS_CHANGED, SERVER_STATE } from '../pubsub'

let server: Server

export default {
	Query: {
		async serverState() {
			console.log('query: serverstate')
			if (server) {
				const serverState = server.services
					.getService<UIService>('ui-service')
					.getServerState()
				return serverState
			}
			console.log('starting server')

			const { run } = getServerRunner(
				path.join(getProjectLocation(), '/src/main.ts')
			)
			server = await run()

			const serverState = server.services
				.getService<UIService>('ui-service')
				.getServerState()
			await server.stop()
			server = null

			return serverState
		}
	},
	Mutation: {
		async startServer() {
			console.log('starting server')
			const { run } = getServerRunner(
				path.join(getProjectLocation(), '/src/main.ts')
			)
			console.log('got running server')
			server = await run()
			return true
		},

		async stopServer() {
			await server.stop()
			return true
		},
		async saveConfig(parent, args: { config: string }) {
			console.log('mutation: save config', args)
			// const config = JSON.stringify(args.config)
			fs.writeFileSync(
				path.join(getProjectLocation(), '/src/config.json'),
				args.config,
				{ encoding: 'utf8' }
			)

			return true
		},
		async watch() {
			console.log('starting watch')
			watchFiles(path.join(getProjectLocation(), '/src/**/*'), async () => {
				if (server) server.stop()
				const { run } = getServerRunner(
					path.join(getProjectLocation(), '/src/main.ts')
				)
				server = await run()

				const serverState = server.services
					.getService<UIService>('ui-service')
					.getServerState()

				await pubsub.publish(SERVER_STATE, {
					serverState
				})

				server.stop()
			})

			return true
		}
	},
	Subscription: {
		hooksChanged: {
			subscribe: () => pubsub.asyncIterator([PUBSUB_HOOKS_CHANGED])
		},
		serverState: {
			subscribe: () => pubsub.asyncIterator([SERVER_STATE])
		}
	}
}
