import { IPipe, addPipe, runApplicationPipe } from './pipes'
import { createOperator } from './utils'
import { IApplication } from './application'

export interface IEvent {
	name: string
	description?: string
	pipes?: (string | IPipe)[]
}

export const addEvent = createOperator(
	({ pipes = [], ...event }: IEvent, context: any) => {
		const newEvent = { ...event, pipes: [] }

		newEvent.pipes = pipes.map(pipe => {
			if (typeof pipe === 'string') return pipe

			addPipe(pipe)(context)

			return pipe.name
		})

		context.events[newEvent.name] = newEvent
	}
)

export const triggerEvent = createOperator(
	async (
		{ name, props }: { name: string; props?: any },
		context: IApplication
	) => {
		if (context.events[name]) {
			for (let pipe of context.events[name].pipes) {
				if (typeof pipe === 'string')
					await runApplicationPipe({ name: pipe, props })(context)
			}
		}
	}
)
