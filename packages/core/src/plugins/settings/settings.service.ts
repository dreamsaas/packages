import { Server, Service, SettingConfiguration } from "dreamsaas";



export class SettingsService implements Service{
    id='settings'
    server:Server
    settingsConfigurations:SettingConfiguration[] = []

    constructor({server}:{server:Server}){
        this.server = server
    }

    addSettings(settings:SettingConfiguration[]){
        if(Array.isArray(settings)) this.settingsConfigurations = this.settingsConfigurations.concat(settings)
    }

    getSetting(id:string){
        if(!this.server.config.settings) return this.getSettingDefault(id)
        
        if(typeof this.server.config.settings[id] === 'undefined') return this.getSettingDefault(id)

        return this.server.config.settings[id]
    }
    
    getSettingConfiguration(id:string){
        return this.settingsConfigurations.find(setting=>setting.id === id)
    }

    getSettingDefault(id:string){
        const config =  this.getSettingConfiguration(id)
            if(!config || typeof config.default === 'undefined') return null
            return config.default
    }

}