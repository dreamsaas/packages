import { SettingsService } from '../plugins/settings/settings.service'

declare module '@dreamsaas/types' {
	export interface SettingConfiguration {
		id: string
		default: any
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
