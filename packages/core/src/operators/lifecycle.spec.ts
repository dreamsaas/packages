import {
	createPlugin,
	onPluginCreated,
	onPluginSetup,
	onPluginRun,
	onPluginStop
} from './plugin'
import { createServer } from '../create-server'
import { setupServer, runServer, stopServer } from './lifecycle'
import { merge } from '../utils'

describe('lifecycle', () => {
	it('should run plugin setup', async () => {
		const setup = jest.fn((context: any) =>
			merge(context, { server: { changed: true } })
		)
		const run = jest.fn()
		const stop = jest.fn()

		const myPlugin = () =>
			createPlugin({ id: 'id' })(
				onPluginSetup(setup),
				onPluginRun(run),
				onPluginStop(stop)
			)

		const context = await createServer()(
			myPlugin(),
			setupServer(),
			runServer(),
			stopServer()
		)

		expect(setup).toBeCalled()
		expect(run).toBeCalled()
		expect(stop).toBeCalled()
		expect(context.server.changed).toBe(true)
	})
})
