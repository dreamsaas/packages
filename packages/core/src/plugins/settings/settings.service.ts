import { Server, Service, SettingConfiguration } from '@dreamsaas/types'
import * as merge from 'deepmerge'

export class SettingsService implements Service {
	id = 'settings'
	server: Server
	settingsConfigurations: SettingConfiguration[] = []

	constructor({ server }: { server: Server }) {
		this.server = server
	}

	addSettings(settings: SettingConfiguration[]) {
		if (Array.isArray(settings))
			this.settingsConfigurations = this.settingsConfigurations.concat(settings)
	}

	setSetting(id: string, value) {
		this.server.config.settings[id] = value
	}

	getSetting(id: string) {
		return this.server.config.settings[id]
	}

	getSettingConfiguration(id: string) {
		return this.settingsConfigurations.find(setting => setting.id === id)
	}

	getSettingDefault(id: string) {
		const config = this.getSettingConfiguration(id)
		if (!config || typeof config.default === 'undefined') return null
		return config.default
	}

	getSettingsFromPlugins() {
		const plugins = this.server.plugins
		//@ts-ignore
		const uncombinedSettings: SettingConfiguration[] = merge.all(
			plugins.map(plugin => plugin.settings || [])
		)

		const settings = uncombinedSettings.reduce((previous, current, index) => {
			const existingSetting = previous.find(prev => prev.id === current.id)
			if (existingSetting) {
				return previous.map(setting => {
					if (setting.id === current.id) {
						return { ...setting, ...current }
					}
				})
			}
			return previous.concat(current)
		}, [])

		return settings
	}
}
