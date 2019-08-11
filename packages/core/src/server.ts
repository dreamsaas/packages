import { Config, Server } from '@dreamsaas/types'
import { ExternalPluginLoaderPlugin } from './plugins/external-plugin-loader/external-plugin-loader.plugin'
import { HooksPlugin } from './plugins/hooks/hooks.plugin'
import { RunnablePlugin } from './plugins/runnable/runnable.plugin'
import { ServicesPlugin } from './plugins/services/services.plugin'
import SettingsPlugin from './plugins/settings/settings.plugin'
import SetupPlugin from './plugins/setup/setup.plugin'
import { ExtendableServer } from './extendable-server'
import LoggablePlugin from './plugins/loggable/loggable.plugin'

/**
 * Creates a new DreamSaaS server instance 🔥
 *
 * This will:
 * - Bootstrap the server with core plugins
 * - Import external plugins defined in configuration
 * - Return a server instance ready for further changes before setup.
 *
 * Call `await server.setup()` after other programmatic changes (like `server.use(new Plugin())`)
 * have been made. This will run the server setup process with all plugins and changes
 * in place.
 *
 * After `await server.setup()`, call `await server.start()` to start runnable services.
 *
 * If needed, use `await server.stop()` to stop all running processes.
 *
 */
export const createServer = async (config: Config): Promise<Server> => {
	const server: Server = new ExtendableServer(config)
	await server.use(new ServicesPlugin())
	await server.use(new HooksPlugin())
	await server.use(new LoggablePlugin())
	await server.use(new RunnablePlugin())
	await server.use(new ExternalPluginLoaderPlugin())
	await server.use(new SettingsPlugin())
	await server.use(new SetupPlugin())

	server.log({ type: 'info', message: 'SERVER CREATED SUCCESSFULLY' })
	server.log({
		type: 'debug',
		message: 'Plugins loaded after create',
		context: server.plugins.map(plugin => plugin.id)
	})
	server.log({
		type: 'debug',
		message: 'Registered hooks',
		context: server.hooks.getHooks()
	})

	return server
}
