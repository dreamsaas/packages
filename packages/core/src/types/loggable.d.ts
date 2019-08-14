declare module '@dreamsaas/types' {
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

	export interface Server {
		log?(optoins: LogOptions): Promise<any>
	}
}
