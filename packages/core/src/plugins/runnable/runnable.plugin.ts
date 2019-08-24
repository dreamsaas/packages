import { Plugin, Server } from '@dreamsaas/types'

export const hooks = {
	SERVER_BEFORE_START: 'SERVER_BEFORE_START',
	SERVER_START: 'SERVER_START',
	SERVER_AFTER_START: 'SERVER_AFTER_START',
	SERVER_BEFORE_STOP: 'SERVER_BEFORE_STOP',
	SERVER_STOP: 'SERVER_STOP',
	SERVER_AFTER_STOP: 'SERVER_AFTER_STOP'
}
export class RunnablePlugin implements Plugin {
	public id = 'runnable'
	hidden=true

	public hooks = hooks

	static SERVER_START = ''
	created(server: Server) {
		server.start = async () => {
			let result = await server.hooks.runHook(
				this.hooks.SERVER_BEFORE_START,
				server
			)
			result = await server.hooks.runHook(this.hooks.SERVER_START, result)
			result = await server.hooks.runHook(this.hooks.SERVER_AFTER_START, result)
		}

		server.stop = async () => {
			let result = await server.hooks.runHook(
				this.hooks.SERVER_BEFORE_STOP,
				server
			)
			result = await server.hooks.runHook(this.hooks.SERVER_STOP, result)
			result = await server.hooks.runHook(this.hooks.SERVER_AFTER_STOP, result)
		}
	}
}
