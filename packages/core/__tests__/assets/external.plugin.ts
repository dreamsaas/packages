import { Plugin, Server } from '@dreamsaas/types'

// declare module '@dreamsaas/types' {
// 	interface Server {
// 		myplugin: { prop: string; getContent(): string }
// 	}
// }

export default class ExternalPlugin implements Plugin {
	id = 'myplugin'
	settings = [{ id: 'mysetting' }]

	created(server: Server, options = { content: 'not passing content' }) {
		//@ts-ignore
		server.myplugin = { prop: 'has-stuff', getContent: () => options.content }
	}
}
