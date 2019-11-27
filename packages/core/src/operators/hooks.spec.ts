import { Hook, Action } from '@dreamsaas/types'
import { createServer } from '../create-server'
import { addHook, addHookAction, runHook } from './hooks'
import { addAction } from './actions'

describe('hooks', () => {
	it('should add hook', async () => {
		const hook: Hook = {
			id: 'theid'
		}

		const context = await createServer()(addHook(hook))

		expect(context.server.hooks[0]).toMatchObject(hook)
	})

	it('should add action to hook', async () => {
		const hook: Hook = {
			id: 'theid'
		}

		const action: Action = {
			id: 'theid',
			func: (value: any, options: any) => options
		}
		const context = await createServer()(
			addHook(hook),
			addAction(action),
			addHookAction(hook.id, action.id, { option1: true })
		)

		expect(
			context.server.hookActions[hook.id][0]
		).toMatchObject({
			id: action.id,
			opts: { option1: true }
		})
	})

	it('should run hook actions', async () => {
		const actionFn = jest.fn()
		const actionFn2 = jest.fn()
		const hook: Hook = {
			id: 'theid'
		}

		const action: Action = {
			id: 'theid',
			func: actionFn
		}
		const action2: Action = {
			id: 'theid2',
			func: actionFn2
		}
		const context = await createServer()(
			addHook(hook),
			addAction(action),
			addAction(action2),
			addHookAction(hook.id, action.id, { option1: true }),
			addHookAction(hook.id, action2.id, { option2: true }),
			runHook(hook.id, { hookOption: true })
		)

		expect(actionFn).toBeCalled()
		expect(actionFn2).toBeCalled()
	})
})
