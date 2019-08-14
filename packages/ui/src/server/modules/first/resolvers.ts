import { Server } from '@dreamsaas/types'
import * as path from 'path'
import { UIService } from '../../../ui.service'
import {
	getProjectLocation,
	getServerRunner,
	watchFiles
} from '../project-manager'
import {
	pubsub,
	PUBSUB_HOOKS_CHANGED,
	PUBSUB_UI_SETTINGS_CHANGED
} from '../pubsub'

let server: Server
export default {
	Query: {
		async config() {
			const config = require(getProjectLocation() + '/src/config.json')
			return JSON.stringify(config)
		},
		async plugins() {
			const { run } = getServerRunner(
				path.join(getProjectLocation(), '/src/main.ts')
			)
			server = await run()
			const plugins = server.plugins.map(plugin => plugin.id)
			await server.stop()
			return plugins
		},
		async hooks() {
			const { run } = getServerRunner(
				path.join(getProjectLocation(), '/src/main.ts')
			)
			server = await run()
			const items = server.hooks.hooks.map(item => item.id)
			await server.stop()
			return items
		},
		async actions() {
			const { run } = getServerRunner(
				path.join(getProjectLocation(), '/src/main.ts')
			)
			server = await run()
			const items = server.hooks.actions.map(item => item.id)
			await server.stop()
			return items
		},
		async services() {
			const { run } = getServerRunner(
				path.join(getProjectLocation(), '/src/main.ts')
			)
			server = await run()
			const items = server.services.getServices().map(items => items.id)
			await server.stop()
			return items
		}
	},
	Mutation: {
		async startServer() {
			const { run } = getServerRunner(
				path.join(getProjectLocation(), '/src/main.ts')
			)
			server = await run()
			pubsub.publish(PUBSUB_HOOKS_CHANGED, {
				hooksChanged: server.hooks.hooks.map(i => i.id)
			})
			return true
		},

		async stopServer() {
			await server.stop()
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

				await pubsub.publish(PUBSUB_HOOKS_CHANGED, {
					hooksChanged: server.hooks.hooks.map(i => i.id)
				})

				const uiSettings = server.services
					.getService<UIService>('ui-service')
					.getUIConfig()

				await pubsub.publish(PUBSUB_UI_SETTINGS_CHANGED, {
					uiSettingsChanged: uiSettings
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
		uiSettingsChanged: {
			subscribe: () => pubsub.asyncIterator([PUBSUB_UI_SETTINGS_CHANGED])
		}
	}
}
