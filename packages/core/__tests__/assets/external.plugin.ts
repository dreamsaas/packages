import { Plugin, Server } from '@dreamsaas/core'

declare module '@dreamsaas/core' {
	interface Server {
		myplugin: { prop: string; getContent(): string }
	}
}

export default class ExternalPlugin implements Plugin {
	id = 'myplugin'
	settings = [{ id: 'mysetting' }]

	created(server: Server, options = { content: 'not passing content' }) {
		server.myplugin = { prop: 'has-stuff', getContent: () => options.content }
	}
}
