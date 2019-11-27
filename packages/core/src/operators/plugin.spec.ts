import { createServer } from '../create-server'
import {
	usePlugins,
	createPlugin,
	requirePluginContext,
	onPluginCreated,
	onPluginSetup,
	onPluginRun,
	onPluginStop
} from './plugin'
import { debug } from './debug'

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

	it('should requirePluginContext', async () => {
		const pluginOperator = () =>
			requirePluginContext((context: any) => {
				//check that the function was called
				expect(context.plugin.id).toBe('id')
			})

		const myPlugin = () =>
			createPlugin({ id: 'id' })(pluginOperator())

		await createServer()(myPlugin())

		expect(true).toBe(true) // should get here without throw

		// try operator without plugin context
		try {
			await createServer()(pluginOperator())
		} catch (error) {
			expect(error.message).toContain('storePlugin')
		}

		expect.assertions(3)
	})

	it('should inject lifecycle hooks', async () => {
		const created = () => 'created'
		const setup = () => 'setup'
		const run = () => 'run'
		const stop = () => 'stop'

		const myPlugin = () =>
			createPlugin({ id: 'id' })(
				onPluginCreated(created),
				onPluginSetup(setup),
				onPluginRun(run),
				onPluginStop(stop)
			)

		const { server } = await createServer()(myPlugin())

		const plugin = server.plugins[0]

		expect(plugin.created()).toBe('created')
		expect(plugin.setup()).toBe('setup')
		expect(plugin.run()).toBe('run')
		expect(plugin.stop()).toBe('stop')
	})

	it('should run plugin created lifecylce hook', async () => {
		const order = []
		// Make sure it waits for async by checking order inputs.
		const created = async (context: any) => {
			await new Promise(r => setTimeout(r, 10))
			order.push('plugin')
			expect(context.plugin.id).toBe('id')
		}

		const myPlugin = () =>
			createPlugin({ id: 'id' })(onPluginCreated(created))

		const { server } = await createServer()(myPlugin())
		order.push('finished')
		expect(order).toMatchObject(['plugin', 'finished'])
		expect.assertions(2)
	})
})
