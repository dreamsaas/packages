import { Plugin, PluginConfig, Server } from "dreamsaas";

export const hooks = {
    PLUGINS_BEFORE_LOAD: 'PLUGINS_BEFORE_LOAD',
    PLUGINS_AFTER_LOAD:'PLUGINS_AFTER_LOAD'
}

export class ExternalPluginLoaderPlugin implements Plugin{
    id = 'external-plugin-loader'
    
    hooks = hooks

    async created(server:Server){
            await server.hooks.runHook(hooks.PLUGINS_BEFORE_LOAD, server)
            
            if(Array.isArray(server.config.plugins)){
                const importablePlugins = server.config.plugins.filter(plugin=>{
                    if(plugin.path) return true
                })
                const importedPlugins = this.importPlugins(importablePlugins)
                const organizedPlugins = this.reorganizeAndCheckPluginDependencies(importedPlugins)
                this.addPluginHooks(organizedPlugins, server)
                await this.addPlugins(organizedPlugins, server)
            }
            
            await server.hooks.runHook(hooks.PLUGINS_AFTER_LOAD, server)
    }
    
    /**
     * Plugins must be imported and instantiated to gain access to instance properies for setup.
     */
    private importPlugins(plugins: PluginConfig[]){
        return plugins.map(plugin=>{
            // TODO: accept paths absolute, npm modules, or relative to project root
            const importedPlugin = require(plugin.path).default
            const isClass = typeof importedPlugin === 'function'
            
            // A plugin can be an object, so pass the appropriate type.
            const instance =  isClass? new importedPlugin(): importedPlugin
            if(!plugin.id) plugin.id = instance.id
            return instance
        })
    }
    
    private reorganizeAndCheckPluginDependencies(plugins){
        // TODO: Before adding and running plugins, run dependency reorganization.
        return plugins
    }

    /**
     * Automatically registers a plugin's hooks if defined on the instance
     */
    private addPluginHooks(plugins:Plugin[], server:Server){
        plugins.forEach(plugin=>{
            if(typeof plugin.hooks === 'object'){
                for(let hookKey in plugin.hooks){
                    server.hooks.addHook({id:plugin.hooks[hookKey]})
                }
            }
        })
    }

    /**
     * Adds plugins to the server and passes their configuration options for the setup function.
     */
    private async addPlugins(plugins:Plugin[], server:Server){
        for(let plugin of plugins){
            const pluginConfig = server.config.plugins.find(iPlugin=>iPlugin.id === plugin.id)
            await server.use(plugin, pluginConfig.options)
        }
    }
}

export default ExternalPluginLoaderPlugin