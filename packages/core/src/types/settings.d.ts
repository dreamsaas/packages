import { SettingsService } from '../plugins/settings/settings.service'

declare module '@dreamsaas/types' {
	export type SettingType =
		| 'string'
		| 'number'
		| 'array'
		| 'keyvalue'
		| 'boolean'
		| 'select'
	//TODO: Need to really take the time to flesh out the settings API

	export interface SettingConfiguration {
		id: string
		type?: SettingType
		default?: any
		label?: string
		description?: string
	}

	export interface Plugin {
		settings?: SettingConfiguration[]
	}

	export interface Action {
		settings?: SettingConfiguration[]
	}

	export interface Server {
		settings?: SettingsService
	}

	export interface Config {
		/**
		 * Settings applied via the settings API
		 */
		settings?: {
			[name: string]: any
		}
	}
}
