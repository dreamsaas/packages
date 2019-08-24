import merge from 'deepmerge'
import {
	Plugin,
	Server,
	ActionSettingsUI,
	Service,
	SettingConfiguration
} from '@dreamsaas/types'

const mergeOnId = (items: { id: string }[]) => {}

export class UIService implements Service {
	id = 'ui-service'
	constructor(public server: Server) {}

	getServerState() {
		const pluginInstances = this.server.plugins
		const plugins = pluginInstances.map(({ id, hooks, hidden,version,dependencies,settingsUI}) => ({
			id,
			hooks,
			hidden,
			version,
			dependencies,
			settingsUI
		}))
		const uiSettings = {
			pages: [],
			sidebar: [],
			sections: [],
			components:[],
			...merge.all(pluginInstances.map(plugin => plugin.settingsUI || {}))
		}

		const settings = this.server.settings.getSettingsFromPlugins()

		const config = this.server.config

		return {
			plugins,
			config,
			settings,
			uiSettings
		}
	}
}
