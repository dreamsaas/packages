import plugin from '../ui'
export default plugin

declare module '@dreamsaas/types' {
	export type PrimitiveSettingsType = 'string' | 'number' | 'boolean'

	export type SettingType =
		| PrimitiveSettingsType
		| 'list'
		| 'keyvalue'
		| 'choice'

	export interface SettingConfiguration {
		type?: SettingType
		label?: string
		description?: string
		choices?: any[]
		keyValueType?: PrimitiveSettingsType
		listType?: PrimitiveSettingsType
		/**
		 * Vue component name used to override the default.
		 */
		component?: string
	}

	export interface Link {
		text: string
		pageId: string
	}

	export interface Sidebar {
		links: Link[]
	}

	export interface AdminSection {
		id: string
		heading?: string
		description?: string
		settings?: string[] //setting id
		component?: string
	}

	export interface AdminPage {
		id: string
		path: string
		heading?: string
		description?: string
		settings?: string[] //setting id
		sections?: [] // admin section id
		component?: string
	}

	export interface Component {
		/** The Path to resolve from the developer's project to get the .vue file */
		path: string
		/** Optional name of the component, otherwise will pull from the component's name property */
		name?: string
	}

	export interface PluginSettingsUI {
		sidebar?: Link[]
		pages?: AdminPage[]
		sections?: AdminSection[]
		/**
		 * Vue components to be loaded in to the admin app
		 */
		components?: Component[]
	}

	export interface ActionSettingsUI {
		sections?: AdminSection[]
		/** Human readable name for the action. */
		name?: string
	}

	export interface Plugin {
		settingsUI?: PluginSettingsUI
	}

	export interface Action {
		/* Type of Action. This string is used to filter available actions in the UI Settings */
		type?: string
		options: SettingConfiguration[]
		settingsUI?: ActionSettingsUI[]
	}
}
