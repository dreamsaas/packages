import '@actual/core'
import { UIService } from './ui.service'
import { Plugin, Server } from './types/index'
export default class UIPlugin implements Plugin {
	id = 'ui'
	settingsUI = {
		pages: [{ id: 'mypage' }],
		sidebar: [
			{
				text: 'text',
				pageName: 'home'
			},
			{
				text: 'text',
				pageName: 'home'
			},
			{
				text: 'text',
				pageName: 'home'
			},
			{
				text: 'text',
				pageName: 'home'
			}
		]
	}

	created(server: Server) {
		server.services.addService(new UIService(server))
	}
}
