import { Plugin, Server } from "dreamsaas";
import { SettingsService } from './settings.service'


export default class SettingsPlugin implements Plugin{
    id='settings'
    server:Server
    
    created(server:Server, options){
        this.server = server
        const settingsService = new SettingsService({server})
        server.services.addService(settingsService)
        server.settings = settingsService

        server.plugins.forEach(plugin=>{
            if(plugin.settings) settingsService.addSettings(plugin.settings)
        })
    }

    loadPluginSettings(plugin:Plugin){
        if(plugin.settings) this.server.settings.addSettings(plugin.settings)
    }
}