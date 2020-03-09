import { createOperator } from './utils'
import { IApplication } from './application'
import { pipe } from 'ramda'
import { addEvent } from './events'
import { addPipe } from './pipes'

export interface IAction<Props = {}, Context = IApplication> {
	name: string
	description?: string
	run: (props: Props, context: Context) => any
}

export interface IAddActionInput<Props = {}, Context = IApplication> {
	name: string
	description?: string
	run: (props: Props, context: Context) => any
	pipes?: string[]
	all?: boolean
}

export const addAction = createOperator<IAddActionInput>(
	({ pipes = [], all = false, ...newAction }, context) => {
		context.actions[newAction.name] = newAction

		if (all) {
			addEvent({
				name: newAction.name,
				description: newAction.description
			})(context)
			addPipe({
				name: newAction.name,
				description: newAction.description,
				events: [newAction.name],
				actions: [newAction.name]
			})(context)
		} else {
			pipes.forEach(pipeName => {
				const foundPipe = context.pipes[pipeName]
				if (foundPipe) {
					foundPipe.actions = foundPipe.actions.concat(newAction.name)
				}
			})
		}
	}
)
