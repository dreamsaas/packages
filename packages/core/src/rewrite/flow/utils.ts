import { Dict, NodeInstance } from './types'

export const createDict = <T extends { id: string }>(def: T): Dict<T> => ({
	[def.id]: def
})
export const createNodeInstance = (instanceConfig: NodeInstance) =>
	createDict<NodeInstance>({
		inputs: {},
		outputs: {},
		options: {},
		status: 'not_run',
		...instanceConfig
	})

export const createValue = (type: string, value: any) => ({ type, value })
