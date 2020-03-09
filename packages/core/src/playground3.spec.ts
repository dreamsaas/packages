import { pipe } from './utils'

interface IAction {
	name: string
	description?: string
	run: (context: any) => any
}

interface IPipe {
	name: string
	description?: string
	actions?: (string | IAction)[]
}

interface IEvent {
	name: string
	description: string
	pipes: string[]
}

interface Application {
	actions: Function[]
	state: {}
	pipes: {
		[name: string]: IPipe
	}
	events: {
		[name: string]: IEvent
	}
}
const createApplication = (...funcs: Function[]) => {}

type PipeableFunction = (context: any) => any

// type InferReturn<F>=

/**
 * Create a pipeable function with arguments
 */
const pipeable = <T, C>(func: (args: T, context: C) => any) => (
	args: T
): PipeableFunction => (context: any) => func(args, context)

const addPipe = pipeable(({ actions = [], ...pipe }: IPipe, context: any) => {
	const newPipe = { ...pipe, actions: [] }

	newPipe.actions = actions.map(action => {
		if (typeof action === 'string') return action

		addAction(action)(context)

		return action.name
	})

	context.pipes.push(newPipe)
})

const addAction = pipeable((config: IAction, context: any) => {
	context.actions.push(config)
})

// type Merge<A extends object, B extends object> = ID<[P in keyof (L & R)]:P>
// const a = { a: 1, A: 'b', b: 'string' }
// const b = { b: 1, B: 'b' }
// type A = typeof a
// type B = typeof b
type Id<T> = { [P in keyof T]: T[P] }

type Merge<A, B> = Id<
	{
		[P in keyof (Pick<A, Exclude<keyof A, keyof B>> & B)]: (Pick<
			A,
			Exclude<keyof A, keyof B>
		> &
			B)[P]
	}
>

describe('testing2', () => {
	it('should', async () => {
		// const result = await pipe(
		// 	addPipe({
		// 		name: 'pipe1',
		// 		actions: [{ name: 'action1', run: (context: any) => context }]
		// 	})
		// )({
		// 	pipes: [],
		// 	actions: []
		// })

		const merge = <T>(args: T) => <U>(context: U) => ({
			...context,
			...args
		})

		const a = merge({ a: 1, b: 2 })({ c: '2' })

		const result = await pipe(merge({ services: { thing2: 2 } }))({
			services: { thing1: 1, thing2: 'string' },
			a: 1
		})

		// console.log(result)
		// build entire application before running ANY logic.
		// you should be able to get the full application json for
		// how the entire app starts up and runs.
	})
})
