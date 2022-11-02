import { createDict, createValue } from './utils'
import { NodeDefinition } from './types'

export const double = createDict<NodeDefinition>({
	id: 'double',
	run({ number, text }) {
		return {
			number: (number && createValue('number', number.value * 2)) || null,
			text:
				(text && createValue('string', `${text.value} ${text.value}`)) || null
		}
	}
})

export const convertToString = createDict<NodeDefinition>({
	id: 'convertToString',
	run({ number }) {
		return {
			text: createValue('string', number.value.toString())
		}
	}
})

export const customValue = createDict<NodeDefinition>({
	id: 'customValue',
	run(input, { value }) {
		return {
			value
		}
	}
})

export const wait = createDict<NodeDefinition>({
	id: 'wait',
	async run(_, { time }) {
		await new Promise(r => setTimeout(r, time.value))
		return {}
	}
})
