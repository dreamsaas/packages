import { IApplication, createApplication } from '../application'
import { addAction } from '../actions'
import { triggerEvent, addEvent } from '../events'
import { addPipe } from '../pipes'

export const bootstrap = async (config: Partial<IApplication>) => {
	const app = await createApplication(
		addAction({
			name: 'action 1',
			run: (props, context) => {
				console.log('action 1', props)
				setTimeout(() => {
					triggerEvent({ name: 'event 2', props: props + '1' })(context)
				}, 1000)
			}
		}),
		addAction({
			name: 'action 2',
			run: props => console.log('action 2', props)
		}),
		// addPipe({
		// 	name: 'pipe 1',
		// 	actions: ['action 1', 'action 2']
		// }),
		// addPipe({
		// 	name: 'pipe 2',
		// 	actions: ['action 2']
		// }),
		// addEvent({
		// 	name: 'event 1',
		// 	pipes: ['pipe 1']
		// }),
		// addEvent({
		// 	name: 'event 2',
		// 	pipes: ['pipe 2']
		// }),
		triggerEvent({ name: 'event 1', props: 'the payload' })
	)(config)

	return app
}
