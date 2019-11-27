import { Server } from '@dreamsaas/types'

declare module '@dreamsaas/types' {
	export interface Config {}

	export interface Server {
		config?: Config
	}
}

export const applyConfig = (config: {}) => (server: Server) => ({
	...server,
	config
})
