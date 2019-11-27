import { Hook, Action } from '@dreamsaas/types'
import { createServer } from '../create-server'
import {
	addHook,
	addHookAction,
	runHook
} from '../operators/hooks'
import { addAction } from '../operators/actions'

describe('hooks', () => {
	it('should add hook', async () => {
		const hook: Hook = {
			id: 'theid'
		}

		const context = await createServer()(addHook(hook))

		expect(context.server.hooks[0]).toMatchObject(hook)
	})
})
