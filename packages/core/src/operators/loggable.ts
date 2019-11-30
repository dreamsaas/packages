import { Server, Config, ServerContext } from '@dreamsaas/types'
import { createPlugin } from './plugin'
import { merge } from '../utils'

declare module '@dreamsaas/types' {
	export interface Server {
		logger?: (value: any) => any
	}

	export interface Config {
		/**
		 * Default is info
		 */
		logLevel?: 'error' | 'warn' | 'info' | 'debug'
	}

	export interface LogOptions {
		/**
		 * Defaults to `'info'`
		 */
		type?: 'error' | 'warn' | 'info' | 'debug'
		/**
		 * Log message
		 */
		message?: string
		/**
		 * Additional logging information
		 */
		context?: any
	}
}

export const useLogger = ({
	logger: inputLogger
}: {
	logger?: (value: any) => any | false
} = {}) => (context: ServerContext) => {
	const defaultLogger = (value: any) => console.log(value)

	const logger =
		typeof inputLogger === 'boolean' && inputLogger === false
			? null
			: inputLogger || defaultLogger

	return merge(context, { server: { logger } })
}

export const log = (value: any) => (context: ServerContext) => {
	const logger = context.server?.logger
	if (logger) logger(value)
}
