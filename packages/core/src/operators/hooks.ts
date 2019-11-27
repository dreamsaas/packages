import {
	Server,
	ServerContext,
	Hook
} from '@dreamsaas/types'
import { merge } from '../utils'
import { findAction, runAction } from './actions'
import { HookAction } from '@dreamsaas/types'
declare module '@dreamsaas/types' {
	export interface HookAction {
		/* ActionId*/
		id: string
		opts?: any
	}

	export interface Hook {
		id: string
	}

	export interface Server {
		hooks?: Hook[]
		hookActions?: {
			[hookId: string]: HookAction[]
		}
	}
}

export const useHooks = () => (context: ServerContext) =>
	merge(context, { server: { hooks: [], hookActions: {} } })

export const addHook = (hook: Hook) => (
	context: ServerContext
) => {
	const newHook = { actions: [], ...hook }
	return merge(context, { server: { hooks: [newHook] } })
}

const findHook = (
	hookId: string,
	context: ServerContext
) => {
	return context.server.hooks?.find(
		({ id }) => id === hookId
	)
}

export const addHookAction = (
	hookId: string,
	actionId: string,
	options: any = null
) => (context: ServerContext) => {
	const hook = findAction(hookId, context)
	if (!hook) throw new Error(`Hook ${hookId} not found`)
	const action = findAction(actionId, context)
	if (!action)
		throw new Error(`Action ${actionId} not found`)
	const hookAction: HookAction = {
		id: action.id,
		opts: { ...(options && { ...options }) }
	}

	return merge(context, {
		server: { hookActions: { [hookId]: [hookAction] } }
	})
}

export const findHookActions = (
	hookId: string,
	context: ServerContext
): HookAction[] => {
	const hookActions = context.server?.hookActions
	if (hookActions) {
		return hookActions[hookId] || []
	}

	return []
}

export const runHook = (
	id: string,
	options?: any
) => async (context: ServerContext) => {
	const hook = findHook(id, context)
	if (hook) {
		const hookActions = findHookActions(id, context)
		let result = options
		for (let hookAction of hookActions) {
			result =
				(await runAction(hookAction.id, result)(context)) ||
				result
		}
		return result
	}
}
