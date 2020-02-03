import * as Yup from 'yup'

interface IComplexAction {
	[key: string]: any
	name: string
	run: Function
	props?: {}
	returns?: {}
}

interface ITransition {
	from: string
	to: string
}

type Action = Function | IComplexAction

const log = []

const addLog = (item: any) => log.push(item)
const getLog = () => console.log(log)

const removeStackTraceLines = (error: Error, lines = 1) => {
	const stack = error.stack
		.split('\n')
		.filter(line => line.trim().startsWith('at '))

	const newStack = stack.slice(lines)
	error.stack = newStack.join('\n')
	return error
}

const createFrameworkError = (message?: string) =>
	removeStackTraceLines(new Error(message), 2)

const validateProps = (action: Action, props: any, rules: any) => {
	try {
		Yup.object()
			.shape(rules)
			.validateSync(props)
		return true
	} catch (e) {
		throw createFrameworkError(`
ACTION: ${action.name}
	props validation error: 
	
	${JSON.stringify(e.errors)}
	PROPS: ${JSON.stringify(props, null, 4)}
`)
	}
}

const runAction = (action: Action) => async (props: any) => {
	const startProps = JSON.stringify(props)
	if (typeof action === 'function') {
		const value = await action(props)
		addLog(
			`ran Action: ${action.name}. props: ${JSON.stringify(
				props
			)}, returned:${JSON.stringify(value)}`
		)
		return value
	} else {
		if (!action.run) throw new Error('Action must contain a run method')

		action.props && validateProps(action, props, action.props)

		const value = await action.run(props)
		addLog(
			`ran Action: ${action.name}. props: ${JSON.stringify(
				startProps
			)}, returned:${JSON.stringify(value ?? props)}`
		)
		return value
	}
}

const pipe = (...actions: Action[]) => async (props: any) => {
	let value = props
	addLog(`Started Pipe: props: ${JSON.stringify(props)}`)
	for (let action of actions) {
		value = (await runAction(action)(value)) ?? value
	}
	addLog(`Completed Pipe: returned: ${JSON.stringify(value)}`)

	return value
}

const createApp = (...actions: Action[]) => {
	const app = {
		__type__: 'app'
	}
	pipe(...actions)(app)
}

const requireAppProp = {
	__type__: Yup.string()
		.required()
		.matches(new RegExp('app'))
}

const requireServicesProp = (services = {}) => ({
	...requireAppProp,
	services: Yup.object(services).required()
})

const installServicesPlugin = {
	name: 'ServicesPlugin',
	run(props) {
		props.services = { __type__: 'services' }
	}
}
const requireLoggerProp = {
	services: Yup.object({
		logger: Yup.object().required()
	})
}

const installLoggerService = {
	name: 'LoggerService',
	props: {
		...requireServicesProp
	},
	run(props) {
		props.services.logger = {
			log(value: any) {
				console.log(value)
			}
		}
	}
}

describe('testing', () => {
	it('should', async () => {
		createApp(installServicesPlugin, {
			name: 'test',
			props: {
				...requireLoggerProp
			},
			run(props) {}
		})

		// const tripple: Action = {
		// 	name: 'tripple',
		// 	props: {
		// 		value: Yup.number().required()
		// 	},
		// 	run(props, action) {
		// 		props.value = props.value * 3
		// 		action
		// 	}
		// }

		// const ctx: any = await pipe(tripple)(value)
		// getLog()
		// expect(ctx.value).toBe(6)
	})
})
