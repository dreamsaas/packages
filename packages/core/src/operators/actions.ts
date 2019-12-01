import { Action, ServerContext } from '@dreamsaas/types'
import { addContext } from './context'

declare module '@dreamsaas/types' {
	export interface Action {
		id: string
		func: Function
	}

	export interface Server {
		actions?: Action[]
	}
}

export const useActions = () => addContext({ server: { actions: [] } })

//TODO: add check for duplicate actions.
export const addAction = (action: Action) =>
	addContext({ server: { actions: [action] } })

export const findAction = (actionId: string, context: ServerContext) => {
	return context.server.actions?.find(({ id }) => id === actionId)
}
export const runAction = (id: string, options?: any) => async (
	context: ServerContext
) => {
	const action = findAction(id, context)
	if (action) {
		return await action.func(options)
	}
}
