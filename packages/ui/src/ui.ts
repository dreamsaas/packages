import { UIService } from './ui.service'
import {
	Plugin,
	Server,
	SettingConfiguration,
	PluginSettingsUI
} from '@dreamsaas/types'

export default class UIPlugin implements Plugin {
	id = 'ui'
	settings: SettingConfiguration[] = [
		{
			id: 'log-level',
			type: 'string',
			default: 'error',
			label: 'Log Level',
			description: `Log level of the running Node server process.`
		}
	]
	settingsUI: PluginSettingsUI = {
		pages: [
			{
				id: '/server',
				heading: 'Server Settings',
				description: `Settings for the main server process.`,
				settings: ['log-level']
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
