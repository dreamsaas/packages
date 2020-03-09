import { pipe } from '../utils'
import { addAction, IAction } from './actions'
import { createOperator } from './utils'
import { eventNames } from 'cluster'

export interface IPipe {
	name: string
	description?: string
	actions?: string[]
}

export interface IAddPipeInput {
	name: string
	description?: string
	actions?: (string | IAction)[]
	events?: string[]
}
export const addPipe = createOperator<IAddPipeInput>(
	({ actions = [], events = [], ...pipe }, context) => {
		const newPipe = { ...pipe, actions: [] }

		newPipe.actions = actions.map(action => {
			if (typeof action === 'string') return action

			addAction(action)(context)

			return action.name
		})

		events.forEach(eventName => {
			const event = context.events[eventName]
			if (event) {
				event.pipes = event.pipes.concat(newPipe.name)
			}
		})

		context.pipes[newPipe.name] = newPipe
	}
)

export interface IRunApplicationPipeProps {
	name: string
	props?: any
}
export const runApplicationPipe = createOperator<IRunApplicationPipeProps>(
	async ({ name, props }, context) => {
		if (context.pipes[name]) {
			const actionsToRun = context.pipes[name].actions
				.map((actionName: string) => {
					return context.actions[actionName]
				})
				.filter(action => !!action)
			return await pipe(
				...actionsToRun.map(action => ({ props, context }) =>
					action.run(props, context)
				)
			)({ props, context })
		}
	}
)
