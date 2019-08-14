import merge from 'deepmerge'
import { Plugin, Server, ActionSettingsUI, Service } from '@dreamsaas/types'

export class UIService implements Service {
	id = 'ui-service'
	constructor(public server: Server) {}

	getUIConfig() {
		const plugins = this.server.plugins
		const UISettings = merge.all(plugins.map(plugin => plugin.settingsUI || {}))
		return UISettings
	}
}
