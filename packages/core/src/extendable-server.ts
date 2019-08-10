
import { Config, Plugin, Server } from 'dreamsaas';

/**
 * Baseline server instance.
 * 
 * This will only provide an API for setting a config, and extending 
 * functionality via Plugins
 */
export class ExtendableServer implements Server {
  public plugins: Plugin[] = []

  constructor(public config: Config = {}) {}

  async use(plugin:Plugin, options?:{}){
    this.addPlugin(plugin)

    const pluginOptions = this.getPluginConfigOptions(plugin.id)
    const combinedOptions = {...pluginOptions, ...options}
    
    if(typeof plugin.created === 'function') await plugin.created(this,combinedOptions)
  }

  getPlugin(pluginId:string){
    return this.plugins.find(({id})=>id === pluginId)
  }

  addPlugin(plugin: Plugin){
    return this.plugins = this.plugins.concat(plugin)
  }

  getPluginConfigOptions(pluginId:string){
    const foundPluginInConfig = this.getPluginConfig(pluginId)
    return foundPluginInConfig && foundPluginInConfig.options
  }
  
  getPluginConfig(pluginId:string){
    return this.config.plugins && this.config.plugins.find(plugin=>plugin.id === pluginId)
  }
}
