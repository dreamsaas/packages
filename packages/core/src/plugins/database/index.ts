import { Database, DatabaseContext, ServerContext } from '@dreamsaas/types'
import {
	addContext,
	removeContext,
	requireContext
} from '../../operators/context'
import { createPlugin } from '../../operators/plugin'
import { pipe } from '../../utils'
import { useDatabaseService } from './database'
import { useModelService } from './model'

declare module '@dreamsaas/types' {
	export interface Database {
		id: string
		connect?: Function
		disconnect?: Function
		find?: Function
		findOne?: Function
		create?: Function
		update?: Function
		delete?: Function
	}

	export interface Connection {
		id: string
		/** Dreamsaas Database id */
		databaseType: string
		database: string
		hostname?: string
		port?: number
		username?: string
		password?: string
		connectionObject?: any
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

export const findOne = (connectionId: string, options: any) => (
	context: ServerContext
) => {
	const connection = context.server.services.database.connections[connectionId]
	const database =
		context.server.services.database.databases[connection.databaseType]

	return database.findOne(options)
}

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

export const useDatabases = () =>
	createPlugin({ id: 'databases' })(useDatabaseService(), useModelService())
