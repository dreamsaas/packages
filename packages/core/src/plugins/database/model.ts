import { createPlugin, onPluginCreated } from '../../operators/plugin'
import {
	createService,
	onServiceSetup,
	onServiceRun,
	onServiceStop
} from '../../operators/services'
import { addContext, removeContext } from '../../operators/context'
import {
	Model,
	ModelContext,
	ModelField,
	FieldContext,
	Database
} from '@dreamsaas/types'
import { pipe } from '../../utils'
import { debug } from '../../operators/debug'

declare module '@dreamsaas/types' {
	export interface ModelField {
		id: string
		type?: string
		default?: any
		key?: boolean
	}

	export interface Model {
		id: string
		fields?: ModelField[]
	}

	export interface ModelPlugin {
		id: string
		models: {
			[id: string]: Model
		}
	}

	export interface ModelContext extends ServerContext {
		model: Model
	}

	export interface FieldContext extends ModelContext {
		field: ModelField
	}
}

const storeModel = () =>
	addContext(({ model }: ModelContext) => ({
		server: { services: { model: { models: { [model.id]: model } } } }
	}))

const storeField = () =>
	addContext(({ field }: FieldContext) => ({
		model: { fields: { [field.id]: field } }
	}))

export const setFieldType = (type: string) => addContext({ field: { type } })

export const setFieldDefault = (value: any) =>
	addContext({ field: { default: value } })

export const setFieldAsKey = () => addContext({ field: { key: true } })

export const addModelField = (field: ModelField) => (...funcs: Function[]) =>
	pipe(addContext({ field }), ...funcs, storeField(), removeContext('field'))

export const addModel = (model: Model) => (...funcs: Function[]) =>
	pipe(addContext({ model }), ...funcs, storeModel(), removeContext('model'))

export const useModelService = () =>
	createService({ id: 'model' })(
		addContext({ server: { services: { model: { models: {} } } } }),
		onServiceSetup(),
		onServiceRun(),
		onServiceStop()
	)
