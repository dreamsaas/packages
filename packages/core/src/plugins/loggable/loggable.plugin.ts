import {
	LogOptions,
	Plugin,
	Server,
	SettingConfiguration
} from '@dreamsaas/types'
export const hooks = {
	BEFORE_LOG: 'BEFORE_LOG',
	LOG: 'LOG',
	AFTER_LOG: 'AFTER_LOG'
}

export default class LoggablePlugin implements Plugin {
	id = 'loggable'

	hooks = hooks
	settings: SettingConfiguration[] = [
		{
			id: 'log-level',
			default: 'error',
			description: 'log level for running server process',
			label: 'Log level',
			type: 'select'
		}
	]

	created(server: Server, options) {
		if (!server.config.logLevel) {
			server.config.logLevel = 'error'
		}

		server.log = async (logOptions: LogOptions) => {
			let result = await server.hooks.runHook(hooks.BEFORE_LOG, logOptions)
			result = await server.hooks.runHook(hooks.LOG, result)
			result = await server.hooks.runHook(hooks.AFTER_LOG, result)

			return result
		}

		server.hooks.addHookAction(hooks.LOG, {
			id: 'default-log-action',
			handler(log: LogOptions, server) {
				if (log.type === 'error') {
					console.error(log.message, log.context)
				}
				if (server.config.logLevel === 'error') return

				if (log.type === 'warn') {
					console.warn(log.message, log.context)
				}
				if (server.config.logLevel === 'warn') return

				if (log.type === 'info') {
					console.log(log.message, log.context)
				}
				if (server.config.logLevel === 'info') return

				if (log.type === 'debug') {
					console.log(log.message, JSON.stringify(log.context, null, 4))
				}
			}
		})
	}
}
