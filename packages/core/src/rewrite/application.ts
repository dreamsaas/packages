import { IEvent } from './events'
import { IPipe } from './pipes'
import { IAction } from './actions'
import { pipe } from '../utils'
import { createOperator } from './utils'

export interface IApplication {
	actions: {
		[name: string]: IAction
	}
	state: { [name: string]: any }
	pipes: {
		[name: string]: IPipe
	}
	events: {
		[name: string]: IEvent
	}
}

export const createApplication = (...funcs: Function[]) => (
	config: Partial<IApplication> = {
		actions: {},
		state: {},
		pipes: {},
		events: {}
	}
) =>
	pipe(...funcs)({ actions: {}, state: {}, pipes: {}, events: {}, ...config })

export const getConfig = ({ actions, ...app }: IApplication) => app

export const logFlow = (app: IApplication) => {
	const log = []
	for (let eventName in app.events) {
		const event = app.events[eventName]
		log.push(`E: ${event.name}`)
		for (let pipeName of event.pipes) {
			log.push(` |P: ${pipeName}`)
			//@ts-ignore
			const thePipe = app.pipes[pipeName]
			thePipe.actions.forEach(action => {
				log.push(` | |A: ${action}`)
			})
		}
	}
	console.log(log.join('\n'))
}

export const changeState = createOperator(
	(
		func: (state: any, context: IApplication) => void,
		context: IApplication
	) => {
		func(context.state, context)
	}
)
