import { createServer } from '../../create-server'
import { useDatabases } from '.'
import { createDatabaseType, useTypeOrmDatabase } from './database'
import { createConnection } from './connections'
import { addModel } from './model'
import { ConnectionOptions } from 'typeorm'

describe('database', () => {
	it('should', async () => {
		const context = createServer()(
			useDatabases(),
			useTypeOrmDatabase(),
			createConnection({
				id: 'test',
				databaseType: 'typeorm',
				database: ':memory:',
				options: {
					type: 'sqlite',
					name: 'memory',
					synchronize: true,
					dropSchema: true
				} as ConnectionOptions
			})(),
			addModel({ id: 'user' })()
		)
	})
})
