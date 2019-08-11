declare module 'dreamsaas' {
  /**
   * Settings for installing and configuring an external plugin
   */
  export interface PluginConfig {
    /**
     * Plugin id. Only use this if applying options to core or programmatically loaded local plugins
     */
    id?: string
    /**
     * Path used to import external plugins (non-core)
     */
    path?: string
    /**
     * Options custom to the plugin
     */
    options?: {}
  }

  export interface Config {
    /**
     * List of plugins to install and configure
     */
    plugins?: PluginConfig[]
  }
}
