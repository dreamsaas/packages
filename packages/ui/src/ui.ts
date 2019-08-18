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
			id: 'app-name',
			type: 'string',
			default: 'My App',
			label: 'Application Name',
			description: 'A name for your application'
		},
		{
			id: 'log-level',
			type: 'choice',
			choices: ['error', 'warn', 'info', 'debug'],
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
				settings: ['app-name', 'log-level']
			}
		],
		sidebar: [
			{
				pageName: '/server',
				text: 'Server Settings'
			},
			{
				pageName: '/plugins',
				text: 'Plugins'
			}
		]
	}

	created(server: Server) {
		server.services.addService(new UIService(server))
	}
}
