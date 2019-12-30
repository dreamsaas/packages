import { pipe } from '../../utils'
import {
	requireContext,
	addContext,
	removeContext
} from '../../operators/context'
import { ConnectionContext, Connection } from '@dreamsaas/types'

export const storeConnection = () =>
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
