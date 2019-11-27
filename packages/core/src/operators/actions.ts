import {
	Server,
	ServerContext,
	Action
} from '@dreamsaas/types'
import { merge } from '../utils'

declare module '@dreamsaas/types' {
	export interface Action {
		id: string
		func: Function
	}

	export interface Server {
		actions?: Action[]
	}
}

export const useActions = () => (context: ServerContext) =>
	merge(context, { server: { actions: [] } })

//TODO: add check for duplicate actions.
export const addAction = (action: Action) => (
	context: ServerContext
) => merge(context, { server: { actions: [action] } })

export const findAction = (
	actionId: string,
	context: ServerContext
) => {
	return context.server.actions?.find(
		({ id }) => id === actionId
	)
}
export const runAction = (
	id: string,
	options?: any
) => async (context: ServerContext) => {
	const action = findAction(id, context)
	if (action) {
		return await action.func(options)
	}
}
