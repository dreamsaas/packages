import { Plugin, Server } from '@dreamsaas/types'

export default class SetupPlugin implements Plugin {
	id = 'setup'
	hidden=true

	created(server: Server) {
		server.setup = async () => {
			server.log({
				type: 'debug',
				message: 'SERVER SETUP() starting',
				context: {
					pluginsLoaded: server.plugins.map(plugin => plugin.id)
				}
			})
			for (let plugin of server.plugins) {
				if (server.settings && plugin.settings) {
					server.settings.addSettings(plugin.settings)
				}
			}

			for (let plugin of server.plugins) {
				if (typeof plugin.setup === 'function') await plugin.setup(server)
			}
			server.log({ type: 'debug', message: 'SERVER SETUP() complete' })
		}
	}
}
