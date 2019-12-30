import { pipe } from '../../utils'
import {
	createService,
	onServiceSetup,
	onServiceRun,
	onServiceStop
} from '../../operators/services'
import {
	addContext,
	removeContext,
	addFromContext,
	requireContext
} from '../../operators/context'
import { doFor, doIf } from '../../operators/flow-control'
import {
	Database,
	DatabaseContext,
	ConnectionContext,
	Connection
} from '@dreamsaas/types'
import { Sequelize, Model, DataTypes } from 'sequelize'
import { storeConnection } from './connections'

export const storeDatabaseType = () =>
	addContext((context: any) => ({
		server: {
			config: { databases: { [context.database.id]: context.database } }
		}
	}))

export const createDatabaseType = (database: Database) => (
	...funcs: Function[]
) =>
	pipe(
		addContext({ database }),
		...funcs,
		storeDatabaseType(),
		removeContext('database')
	)

/**
 * Defines how a database will connect
 *
 * Includes context for `Database` and `Connection`
 *
 * @param funcs - operators that connect to database.
 */
export const onDatabaseConnect = (...funcs: onDatabaseConnectFunc[]) =>
	pipe(
		requireContext('database', 'onDatabaseConnect'),
		addContext({
			database: {
				connect: pipe(
					requireContext(
						['database', 'connection'],
						'database disconnect pipe'
					),
					...funcs,
					storeConnection()
				)
			}
		})
	)

const connectDatabase = () =>
	pipe(
		requireContext(['database', 'connection'], 'database connect pipe'),
		(context: DatabaseContext) => context.database?.connect(context)
	)

const disconnectDatabase = () =>
	pipe(
		requireContext(['database', 'connection'], 'database disconnect pipe'),
		(context: DatabaseContext) => context.database?.disconnect(context)
	)

type onDatabaseconnectReturn = { connectionObject: any } & Partial<Connection>
type onDatabaseConnectFunc = (
	context: DatabaseContext & ConnectionContext
) => onDatabaseconnectReturn | Promise<onDatabaseconnectReturn>
type onDatabaseDisconnectFunc = (
	context: DatabaseContext & ConnectionContext
) => Promise<onDatabaseconnectReturn> | void | Promise<void>
/**
 * Defines how a database will disconnect
 *
 * Includes context for `Database` and `Connection`
 *
 * @param funcs - operators that disconnect from a database.
 */
export const onDatabaseDisconnect = (...funcs: onDatabaseDisconnectFunc[]) =>
	pipe(
		requireContext('database', 'onDatabaseDisconnect'),
		addContext({
			database: {
				connect: pipe(
					requireContext(
						['database', 'connection'],
						'database disconnect pipe'
					),
					...funcs,
					storeConnection()
				)
			}
		})
	)

export const useTypeOrmDatabase = () =>
	createDatabaseType({ id: 'sql' })(
		onDatabaseConnect(async ({ connection, database, server }) => {
			const sequelize = new Sequelize('sqlite::memory:')

			return {
				connectionObject: sequelize
			}
		}),
		onDatabaseDisconnect(async ({ connection }) => {
			await connection.connectionObject.close()
		})
	)

const connectToDatabases = () =>
	pipe(
		addFromContext([
			'server.services.database.databases',
			'server.services.database.connections'
		]),
		doFor(
			'connections',
			'connection'
		)(
			doFor(
				'databases',
				'database'
			)(doIf('connection.database', 'EQ', 'database.id')(connectDatabase()))
		),
		removeContext(['databases', 'connections'])
	)

const connectFromDatabases = () =>
	pipe(
		addFromContext([
			'server.services.database.databases',
			'server.services.database.connections'
		]),
		doFor(
			'connections',
			'connection'
		)(
			doFor(
				'databases',
				'database'
			)(doIf('connection.database', 'EQ', 'database.id')(disconnectDatabase()))
		),
		removeContext(['databases', 'connections'])
	)

export const useDatabaseService = () =>
	pipe(
		createService({ id: 'database' })(
			addContext({ server: { services: { database: { databases: {} } } } }),
			onServiceSetup(),
			onServiceRun(connectToDatabases()),
			onServiceStop(connectFromDatabases())
		)
	)
