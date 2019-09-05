import '@dreamsaas/types'
import Plugin from '../fastify'
import { HookAction } from '@dreamsaas/types'
export default Plugin
declare module '@dreamsaas/types' {
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
			pre?: HookAction[]
			handler?: HookAction[]
			response?: HookAction[]
		}
	}

	export interface HttpServerConfig {
		routes?: RouteConfig[]
		host?: string
		port?: number
	}

	export interface Config {
		http?: HttpServerConfig
	}
	export interface Server {}
}
