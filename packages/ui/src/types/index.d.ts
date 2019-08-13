import plugin from '../ui'
export default plugin

declare module '@dreamsaas/types' {
	export interface Link {
		text: string
		pageName: string
	}

	export interface Sidebar {
		links: Link[]
	}

	export interface AdminSection {
		id: string
		heading?: string
		description?: string
		settings?: string[] //setting id
	}

	export interface AdminPage {
		id: string
		heading?: string
		description?: string
		settings?: string[] //setting id
		sections?: [] // admin section id
	}

	export interface PluginSettingsUI {
		sidebar?: Link[]
		pages?: AdminPage[]
		sections?: AdminSection[]
	}

	export interface ActionSettingsUI {
		sections?: AdminSection[]
	}

	export interface Plugin {
		settingsUI?: PluginSettingsUI
	}

	export interface Action {
		settingsUI?: ActionSettingsUI[]
	}
}
