import { createPlugin } from '../operators/plugin'
import {
	Database,
	Connection,
	DatabaseContext,
	ConnectionContext,
	ServerContext
} from '@dreamsaas/types'
import { pipe } from '../utils'
import { addContext, removeContext, requireContext } from '../operators/context'
import {
	createService,
	onServiceSetup,
	onServiceRun,
	onServiceStop
} from '../operators/services'

declare module '@dreamsaas/types' {
	export interface Database {
		id: string
	}

	export interface Connection {
		id: string
		database: string
		hostname?: string
		port?: number
		password?: string
		options?: {}
	}

	export interface DatabaseContext extends ServerContext {
        database: Database
	}

	export interface ConnectionContext extends ServerContext {
		connection: Connection
	}

	export interface Services {
		database: {
			databases: { [id: string]: Database }
			connections: { [id: string]: Connection }
		}
	}
}

export const useDatabaseService = () =>
	pipe(
		createService({ id: 'database' })(
			addContext({ server: { services: { database: { databases: {} } } } }),
			onServiceSetup(),
			onServiceRun((context: ServerContext) => {
                const databases = context.server.services.database.databases
                const connections = context.server.services.database.connections
            }),
			onServiceStop()
		)
	)

const storeDatabase = () =>
	pipe(
		requireContext('database', 'storeDatabase'),
		addContext(({ database }: DatabaseContext) => ({
			server: {
				services: { database: { databases: { [database.id]: database } } }
			}
		}))
	)

export const createDatabase = (database: Database) => (...funcs: Function[]) =>
	pipe(
		addContext({ database }),
		...funcs,
		storeDatabase(),
		removeContext('database')
	)

const storeConnection = () =>
	pipe(
		requireContext('connection', 'storeDatabase'),
		addContext(({ connection }: ConnectionContext) => ({
			server: {
				services: { database: { connections: { [connection.id]: connection } } }
			}
		}))
	)

export const createConnection = (connection: Connection) => (
	...funcs: Function[]
) =>
	pipe(
		addContext({ connection }),
		...funcs,
		storeConnection(),
		removeContext('connection')
	)

export const useDatabases = () =>
	createPlugin({ id: 'databases' })(useDatabaseService())
