import {
	Server,
	Config,
	ServerContext
} from '@dreamsaas/types'
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
	logLevel = 'info',
	logger: inputLogger
}: {
	logger?: (value: any) => any
	logLevel?: Config['logLevel']
} = {}) => (context: ServerContext) => {
	const defaultLogger = (value: any) => console.log(value)

	const logger = inputLogger || defaultLogger

	return merge(context, { server: { logger } })
}

export const log = (value: any) => (
	context: ServerContext
) => context.server?.logger && context.server.logger(value)
