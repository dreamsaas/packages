import { Server, Service, Action as iAction } from '@dreamsaas/types'
import { Hook, HookOptions } from './hook'
import { Action } from './action'

interface HookServiceOptions {
	server: Server
}
export class HookService implements Service {
	id = 'HookService'
	hooks: Hook[] = []
	actions: iAction[] = []
	server: Server

	constructor({ server }: HookServiceOptions) {
		this.server = server
	}

	getHooks() {
		return this.hooks
	}

	getHook(id: string) {
		return this.hooks.find(hook => hook.id === id)
	}

	addHook(hook: HookOptions) {
		const originalHook = this.getHook(hook.id)

		if (originalHook) {
			console.warn(`Attempting to add hook with an existing id: ${
				hook.id
			}. Using original instead.
      
      Note that hooks defined in a plugin's hooks property are automatically registered.`)
			return originalHook
		}

		const newHook = new Hook(hook)
		this.hooks = this.hooks.concat(newHook)

		return newHook
	}

	getActions() {
		return this.actions
	}

	getAction(id: string) {
		return this.actions.find(action => action.id === id)
	}

	addAction(action: iAction) {
		if (this.getHook(action.id))
			throw new Error('HookService cannot accept actions with duplicate ids.')

		const newAction = new Action(action)
		newAction.importFunc()
		this.actions = this.actions.concat(newAction)

		return newAction
	}
	addHookAction(hookId, action: iAction, actionOptions: {} = {}) {
		let hook = this.hooks.find(hook => hook.id === hookId)

		if (!hook) {
			hook = this.addHook({ id: hookId })
		}

		const existingAction = this.actions.find(
			iterAction => iterAction.id === action.id
		)

		if (!existingAction) {
			this.addAction(action)
		}

		hook.addAction({ actionId: action.id, options: actionOptions })

		return hook
	}

	async runHook(hookId: string, value?: any) {
		const hook = this.getHook(hookId)
		if (!hook) throw new Error(`runHook failed: hook ${hookId} not found`)

		const actions = hook.actions.map(({ actionId }) => this.getAction(actionId))

		let finalValue = value
		for (const action of actions) {
			if (typeof action.func === 'function')
				finalValue = await action.func(
					finalValue,
					this.server,
					this.getHookActionOptions(hookId, action.id)
				)
		}

		return finalValue
	}

	getHookActionOptions(hookId: string, actionId: string) {
		const hook = this.getHook(hookId)
		const hookAction = hook.actions.find(
			hookAction => hookAction.actionId === actionId
		)
		if (!hookAction) return {}

		return hookAction.options || {}
	}
}
