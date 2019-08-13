import './services'
import './hooks'
import './runnable'
import './external-plugin-loader'
import './settings'
import './setup'
import './loggable'
export * from '../core'

declare module '@dreamsaas/types' {
	/**
	 * Entire server configuration
	 */
	export interface Config {}

	export interface Action {
		/**
		 * Name of the action
		 */
		id: string
		/**
		 * If importing from a file, absolute path to file.
		 */
		filePath?: string
		/**
		 * If importing from a file, export name of function
		 */
		exportName?: string
		/**
		 * Action's function
		 */
		handler?(value: any, server: Server, options: {}): any

		/**
		 * INTERNAL USE ONLY
		 */
		func?(value, server: Server, options: {}): any
	}

	/**
	 * Plugins extend the functionality of the server
	 */
	export interface Plugin {
		/**
		 * Name of the plugin
		 */
		id: string
		/**
		 * Version of the plugin (future)
		 */
		version?: string
		/**
		 * List of plugins that this plugin depends on
		 */
		dependencies?: string[]
		/**
		 * object with hooks string constants.
		 *
		 * Any hooks defined here are automatically registered before plugin created hook.
		 *
		 * example: `{YOUR_HOOK:'YOUR_HOOK'}`
		 *
		 * This is a key value pair so that hooks can be exported for easier discovery and use.
		 */
		hooks?: {}
		/**
		 * Lifecycle function when the plugin is instantiated.
		 *
		 * **Don't add functionality here that other plugins should be able to change.**
		 *
		 * Use this for registering hooks, and registering actions to run on hooks.
		 * Only run hooks within the `setup()` lifecycle function.
		 */
		created?(server?: Server, options?: {}): any | void
		/**
		 * Lifecycle function when all plugins are created and settings have been loaded.
		 *
		 * Use this for primary/extendable logic as all plugins will be run serially when
		 * the developer calls `await server.setup()`
		 */
		setup?(server?: Server, options?: {}): any | void
	}

	/**
	 * Core @dreamsaas/core server
	 *
	 * This is extendable via use of the plugin system
	 */
	export interface Server {
		/**
		 * Master configuration for server
		 */
		config: Config
		/**
		 * List of installed plugins. Do not change unless you know what you're doing.
		 */
		plugins: Plugin[]
		/**
		 * Installs a plugin on the server instance.
		 *
		 * A plugin can either be an object `{}` or a `new` instance of a class.
		 */
		use(plugin: Plugin, options?: {}): any
		/**
		 * Gets a plugin from the config via ID.
		 *
		 * Do not use unless you know what you're doing.
		 */
		getPlugin(pluginId: string): Plugin
		/**
		 * Adds a plugin directly to the plugin list
		 *
		 * Do not use unless you know what you're doing.
		 */
		addPlugin(plugin: Plugin): Plugin[]
	}
}
