import { double, convertToString, customValue, wait } from './node-definitions'
import {
	Definitions,
	Config,
	Transition,
	Dict,
	Value,
	NodeInstanceStatuses,
	NodeInstance
} from './types'
import { createNodeInstance, createValue } from './utils'

const config: Config = {
	nodes: {
		...createNodeInstance({
			id: 'doubleInst',
			nodeType: 'double'
		}),
		...createNodeInstance({
			id: 'doulbeInst2',
			nodeType: 'double'
		}),
		...createNodeInstance({
			id: 'convertToString',
			nodeType: 'convertToString'
		}),
		...createNodeInstance({
			id: 'customValue',
			nodeType: 'customValue',
			options: {
				value: createValue('number', 10)
			}
		}),
		...createNodeInstance({
			id: 'customValue2',
			nodeType: 'customValue',
			options: {
				value: createValue('string', 'bye')
			}
		}),
		...createNodeInstance({
			id: 'wait',
			nodeType: 'wait',
			options: {
				time: createValue('number', 1000)
			}
		}),
		...createNodeInstance({
			id: 'wait2',
			nodeType: 'wait',
			options: {
				time: createValue('number', 1000)
			}
		})
	},
	transitions: [
		{
			from: 'customValue',
			to: 'doubleInst',
			map: {
				value: 'number'
			}
		},
		{
			from: 'wait',
			to: 'customValue2',
			map: {}
		},
		{
			from: 'wait2',
			to: 'convertToString',
			map: {}
		},
		{
			from: 'customValue2',
			to: 'doubleInst',
			map: {
				value: 'text'
			}
		},
		{
			from: 'doubleInst',
			to: 'doulbeInst2',
			map: {
				number: 'number',
				text: 'text'
			}
		},
		{
			from: 'doulbeInst2',
			to: 'convertToString',
			map: {
				number: 'number'
			}
		}
	]
}
const definitions: Definitions = {
	nodeDefinitions: {
		...double,
		...convertToString,
		...customValue,
		...wait
	},
	InputDefinitions: {},
	NodeOptionDefinitions: {},
	OutputDefinitions: {},
	TypeDefinitions: {}
}

const findOrThrowNodeInstance = (id: string) => {
	const nodeInstance = config.nodes[id]
	if (!nodeInstance) throw new Error(`node ${id} not found.`)
	return nodeInstance
}
const findOrThrowNodeDefinition = (id: string) => {
	const nodeDefinition = definitions.nodeDefinitions[id]
	if (!nodeDefinition) throw new Error(`nodeDefinition ${id} not found.`)
	return nodeDefinition
}

const findTransitionsFrom = (id: string) =>
	config.transitions.filter(transition => transition.from === id)
const findTransitionsTo = (id: string) =>
	config.transitions.filter(transition => transition.to === id)

const mapTransitionOutToIn = (transition: Transition, outputs: Dict<Value>) => {
	const mapping = {}
	for (let key in transition.map) {
		mapping[transition.map[key]] = outputs[key]
	}
	return mapping
}

const countInstanceStatuses = (
	status: NodeInstanceStatuses,
	instances: NodeInstance[]
) =>
	instances.reduce((count, instance) => {
		if (instance.status === status) return count + 1
		return count
	}, 0)

export const runNode = async (id: string, passedInputs: Dict<Value> = {}) => {
	// TODO: upflow runs and this node reruns will ignore passed inputs.
	let inputs = { ...passedInputs }
	const nodeInstance = findOrThrowNodeInstance(id)
	const transitionsIn = findTransitionsTo(nodeInstance.id)

	const fromInstances = transitionsIn.map(transition =>
		findOrThrowNodeInstance(transition.from)
	)
	// If any from instance is running, do nothing because this Node will be called again.
	const runningInstanceCount = countInstanceStatuses('running', fromInstances)
	if (runningInstanceCount > 0) return

	// If any from instances haven't run, call them and then do nothing.
	const NotRunInstanceCount = countInstanceStatuses('not_run', fromInstances)
	if (NotRunInstanceCount > 0) {
		fromInstances.forEach(instance => {
			if (instance.status === 'not_run') {
				runNode(instance.id)
			}
		})
		return
	}

	//Assume here all are done, but check just in case for now.
	if (!fromInstances.every(instance => instance.status === 'done')) {
		throw new Error('shouldnt get here because all instances should be done')
	}

	nodeInstance.status = 'running'

	// get input node outputs
	const inputValues = transitionsIn.reduce((input, transition) => {
		const instance = fromInstances.find(inst => inst.id === transition.from)

		const outputs = mapTransitionOutToIn(transition, instance.outputs)
		return { ...input, ...outputs }
	}, {})
	// console.log(id, inputValues, inputs)

	const nodeDefinition = findOrThrowNodeDefinition(nodeInstance.nodeType)
	const outputs = await nodeDefinition.run(
		{ ...inputs, ...inputValues },
		nodeInstance.options
	)

	nodeInstance.outputs = outputs
	nodeInstance.status = 'done'

	// Run downflow nodes
	const transitionsOut = findTransitionsFrom(nodeInstance.id)
	transitionsOut.forEach(transition => runNode(transition.to))
}
