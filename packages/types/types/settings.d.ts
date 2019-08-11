import { SettingsService } from '../plugins/settings/settings.service'

declare module 'dreamsaas' {
  export interface SettingConfiguration {
    id: string
    type?: string
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
