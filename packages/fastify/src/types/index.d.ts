import '@dreamsaas/types'

declare module 'dreamsaas' {
	export interface UrlQuery {
		[key: string]: {
			type: string
		}
	}

	export interface RouteConfig {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
		url: string
		query?: UrlQuery
		action?: string
		hooks?: {
			pre?: string[]
			handler?: string[]
			response?: string[]
		}
	}

	export interface HttpServerConfig {
		routes?: RouteConfig[]
		host?: string
		port?: number
	}

	interface Config {
		http?: HttpServerConfig
	}
	interface Server {}
}
