import { Plugin, Server } from '@dreamsaas/types'
import { SettingsService } from './settings.service'

export default class SettingsPlugin implements Plugin {
	id = 'settings'
	server: Server

	created(server: Server, options) {
		if (!server.config.settings) server.config.settings = {}

		this.server = server
		const settingsService = new SettingsService({ server })
		server.services.addService(settingsService)
		server.settings = settingsService

		//TODO: figure out if this is necessary, and where in the pipeline to do it.
		server.plugins.forEach(plugin => {
			if (plugin.settings) settingsService.addSettings(plugin.settings)
		})
	}

	setup(server: Server) {
		this.setDefaultConfigSettings()
	}

	loadPluginSettings(plugin: Plugin) {
		if (plugin.settings) this.server.settings.addSettings(plugin.settings)
	}

	setDefaultConfigSettings() {
		const settings = this.server.settings.getSettingsFromPlugins()
		console.log('setDefaultConfigSettings', settings)
		settings.forEach(setting => {
			console.log('setDefaultConfigSettings foreach', setting)
			if (typeof this.server.settings.getSetting(setting.id) === 'undefined') {
				if (typeof setting.default !== 'undefined') {
					this.server.settings.setSetting(setting.id, setting.default)
				}
			}
		})
	}
}
