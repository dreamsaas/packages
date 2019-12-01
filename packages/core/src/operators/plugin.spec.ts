import { createServer } from '../create-server'
import { debug } from './debug'
import { runServer, setupServer, stopServer } from './lifecycle'
import {
	createPlugin,
	onPluginCreated,
	onPluginRun,
	onPluginSetup,
	onPluginStop,
	usePlugins
} from './plugin'

describe('plugin', () => {
	it('should add plugins to server', async () => {
		const { server } = await createServer()(usePlugins())

		expect(server.plugins).toMatchObject([])
	})

	it('should add temporary plugin context', async () => {
		const myPlugin = () =>
			createPlugin({ id: 'id' })(
				debug((context: any) => {
					expect(context.plugin.id).toBe('id')
				})
			)

		const context = await createServer()(myPlugin())

		expect(context.plugin).toBeUndefined()
		expect.assertions(2)
	})

	it('should add temporary plugin context', async () => {
		const myPlugin = () =>
			createPlugin({ id: 'id' })(
				debug((context: any) => {
					expect(context.plugin.id).toBe('id')
				})
			)

		const context = await createServer()(myPlugin())

		expect(context.plugin).toBeUndefined()
		expect.assertions(2)
	})

	it('should store plugin mutated in context', async () => {
		const myPlugin = () =>
			createPlugin({ id: 'id' })((context: any) => {
				context.plugin.name = 'name'
			})

		const context = await createServer()(myPlugin())

		expect(context.plugin).toBeUndefined()
		expect(context.server.plugins[0].name).toBe('name')
	})

	it('should inject lifecycle hooks', async () => {
		const created = jest.fn()
		const setup = jest.fn()
		const run = jest.fn()
		const stop = jest.fn()

		const myPlugin = () =>
			createPlugin({ id: 'id' })(
				onPluginCreated(created),
				onPluginSetup(setup),
				onPluginRun(run),
				onPluginStop(stop)
			)

		await createServer()(myPlugin(), setupServer(), runServer(), stopServer())

		expect(created).toBeCalledTimes(1)
		expect(setup).toBeCalledTimes(1)
		expect(run).toBeCalledTimes(1)
		expect(stop).toBeCalledTimes(1)
	})

	it('should run plugin created lifecylce hook', async () => {
		const order = []
		// Make sure it waits for async by checking order inputs.
		const created = async (context: any) => {
			await new Promise(r => setTimeout(r, 10))
			order.push('plugin')
			expect(context.plugin.id).toBe('id')
		}

		const myPlugin = () => createPlugin({ id: 'id' })(onPluginCreated(created))

		const { server } = await createServer()(myPlugin())
		order.push('finished')
		expect(order).toMatchObject(['plugin', 'finished'])
		expect.assertions(2)
	})
})
