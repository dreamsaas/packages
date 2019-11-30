export * from './create-server'
export * from './utils'
declare module '@dreamsaas/types' {
	export interface Server {
		[key: string]: any
	}
}
