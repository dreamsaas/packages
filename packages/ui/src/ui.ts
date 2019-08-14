import { UIService } from './ui.service'
import { Plugin, Server } from '@dreamsaas/types'
export default class UIPlugin implements Plugin {
	id = 'ui'
	settingsUI = {
		pages: [
			{
				id: '/server',
				heading: 'Server Settings',
				description: `Settings for the main server process.`
			}
		],
		sidebar: [
			{
				pageName: '/server',
				text: 'Server Settings'
			}
		]
	}

	created(server: Server) {
		server.services.addService(new UIService(server))
	}
}
