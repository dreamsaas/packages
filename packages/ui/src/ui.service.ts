import merge from 'deepmerge'
import { Plugin, Server, ActionSettingsUI, Service } from './types/index'
// import { Service, Server,ActionSettingsUI } from "dreamsaass";

export class UIService implements Service {
	id = 'ui-service'
	test: ActionSettingsUI
	constructor(public server: Server) {}

	getUIConfig() {
		const plugins = this.server.plugins
		const UISettings = merge.all(plugins.map(plugin => plugin.settingsUI || {}))
		return UISettings
	}
}
