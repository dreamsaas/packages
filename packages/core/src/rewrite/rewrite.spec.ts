import fs from 'fs'
import path from 'path'
import { bootstrapDevApp, EVENTS } from './dev-server'
import { bootstrap } from './app/bootstrap'
import { logFlow } from './application'
import { triggerEvent } from './events'
import { EventSubscriber } from 'typeorm'
const config = require('./app/config.json')

export const testWriteFile = () =>
	fs.writeFileSync(
		path.join(__dirname, '/app/config.json'),
		JSON.stringify({ ...config, some: Math.random() })
	)
export const wait = (timeout: number) =>
	new Promise(r => setTimeout(r, timeout))

const writeFile = describe('rewrite', () => {
	it('should', async () => {
		const devApp = await bootstrapDevApp(path.join(__dirname, '/app'))
		console.log('DevAppReady')
		await wait(1000) // wait for filechange process to trigger
		testWriteFile()
		await wait(1000) // wait for filechange process to trigger
		logFlow(devApp)
		// console.log(JSON.stringify(getConfig(app), null, 4))
		await triggerEvent({ name: EVENTS.STOP_SERVER })(devApp)
		console.log('DevApp stopped')
		await wait(1000)
		expect(true).toBe(true)
	})
})
