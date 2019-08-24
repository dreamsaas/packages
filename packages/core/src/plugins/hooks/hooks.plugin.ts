import { Plugin, Server } from '@dreamsaas/types'
import { HookService } from './hook-service'
import { hooksGenerator } from './hooks.generator'
import { objectExpression } from '@babel/types'

export class HooksPlugin implements Plugin {
	public id = 'hooks'
	hidden=true

	async created(server: Server) {
		const hooks = new HookService({ server })
		server.services.addService(hooks)
		server.hooks = hooks

		await this.extendServerUse(server)

		this.loadHooksFromConfig(server)
	}

	/**
	 * Wraps the original `server.use()` function with one that adds the hooks.
	 * If a plugin is unable to be added via the original function, an exception is
	 * thrown and the server creation fails, so, no need to care if hooks are added
	 * for a plugin that doesn't get registered.
	 */
	extendServerUse(server: Server) {
		const coreUseFunction = server.use.bind(server)
		server.use = async (plugin: Plugin, options: {}) => {
			if (plugin.hooks) {
				for (let key in plugin.hooks) {
					server.hooks.addHook({ id: plugin.hooks[key] })
				}
			}

			await coreUseFunction(plugin, options)
		}
	}

	/**
	 * Loads all config defined hooks and hookActions into hooks and registers
	 * their actions.
	 *
	 * NOTE: This being done here loads configurations before programmatically
	 * added hooks. This will also prevent actions from being automatically added
	 * if a hook is attempted to be created with actions programmatically. Consider
	 * merging existing actions if they exist.
	 */
	loadHooksFromConfig(server: Server) {
		const config = server.config
		if (typeof config.hooks !== 'object') return

		for (let hookId in config.hooks) {
			const actions = config.hooks[hookId].actions || []
			server.hooks.addHook({ id: hookId, actions })
		}
	}

	public hooksGenerator = hooksGenerator
}
