/**
 * Dictionary where keys are any ID and values are of the specified type.
 */
export type Dict<T> = {
	[id: string]: T
}

export interface NodeOptionDefinition {
	id: string
	type: string
	default?: any
	validation?: any
	label?: string
	description?: string
}

export interface InputDefinition {
	id: string
	type: string
	required?: boolean
	label?: string
}

export interface OutputDefinition {
	id: string
	type: string
	label?: string
}

export interface NodeDefinition {
	id: string
	inputs?: Dict<InputDefinition>
	outputs?: Dict<InputDefinition>
	options?: Dict<NodeOptionDefinition>
	run(
		inputs: Dict<Value>,
		options: Dict<Value>
	): Dict<Value> | Promise<Dict<Value>>
	label?: string
	description?: string
}

export type NodeInstanceStatuses = 'not_run' | 'running' | 'done'

export interface NodeInstance {
	id: string
	nodeType: string
	status?: NodeInstanceStatuses
	options?: Dict<Value>
	inputs?: Dict<Value>
	outputs?: Dict<Value>
	comment?: string
}

export interface Transition {
	from: string
	to: string
	map: {
		[output: string]: string
	}
}

export interface TypeDefinition {
	id: string
	label: string
	validation: any
}

export interface Value {
	type: string
	value: any
}

export interface Definitions {
	nodeDefinitions: Dict<NodeDefinition>
	NodeOptionDefinitions: Dict<NodeOptionDefinition>
	InputDefinitions: Dict<InputDefinition>
	OutputDefinitions: Dict<OutputDefinition>
	TypeDefinitions: Dict<TypeDefinition>
}

export interface Config {
	nodes: Dict<NodeInstance>
	transitions: Transition[]
}
