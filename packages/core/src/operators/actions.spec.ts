import { Action } from '@dreamsaas/types'
import { createServer } from '../create-server'
import { addAction, runAction } from './actions'

describe('actions', () => {
	it('should add action', async () => {
		const action: Action = {
			id: 'theid',
			func: (value: any) => value
		}

		const context = await createServer()(addAction(action))

		expect(context.server.actions[0]).toMatchObject(action)
	})

	it('should run action', async () => {
		const func = jest.fn((value: any) => value)
		const action: Action = {
			id: 'theid',
			func
		}

		const context = await createServer()(
			addAction(action),
			runAction('theid', 1)
		)

		expect(func).toBeCalled()
		expect(func).toBeCalledWith(1)
	})
})
