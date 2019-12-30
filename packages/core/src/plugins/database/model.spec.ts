import { createServer } from '../../create-server'
import {
	addModel,
	addModelField,
	setFieldAsKey,
	setFieldDefault,
	setFieldType,
	useModelService
} from './model'

describe('model', () => {
	it('should add models service', async () => {
		const context = await createServer({})(useModelService())

		expect(context.server.services.model).toMatchObject({ models: {} })
	})

	it('should add model', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })()
		)

		expect(context.server.services.model.models).toMatchObject({
			user: { id: 'user' }
		})
	})

	it('should add field to model', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })(addModelField({ id: 'name' })())
		)

		expect(context.server.services.model.models).toMatchObject({
			user: { id: 'user', fields: { name: { id: 'name' } } }
		})
	})

	it('should set field as key', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })(addModelField({ id: 'name' })(setFieldAsKey()))
		)

		expect(context.server.services.model.models).toMatchObject({
			user: { id: 'user', fields: { name: { id: 'name', key: true } } }
		})
	})

	it('should set field type', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })(
				addModelField({ id: 'name' })(setFieldType('text'))
			)
		)

		expect(context.server.services.model.models).toMatchObject({
			user: { id: 'user', fields: { name: { id: 'name', type: 'text' } } }
		})
	})

	it('should set field default', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })(
				addModelField({ id: 'name' })(setFieldDefault('value'))
			)
		)

		expect(context.server.services.model.models).toMatchObject({
			user: {
				id: 'user',
				fields: { name: { id: 'name', default: 'value' } }
			}
		})
	})

	it('should apply multiple field set operations', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })(
				addModelField({ id: 'name' })(
					setFieldAsKey(),
					setFieldType('text'),
					setFieldDefault('value')
				)
			)
		)

		expect(context.server.services.model.models).toMatchObject({
			user: {
				id: 'user',
				fields: {
					name: { id: 'name', default: 'value', key: true, type: 'text' }
				}
			}
		})
	})

	it('should apply multiple models with multiple field set operations', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })(
				addModelField({ id: 'name' })(
					setFieldAsKey(),
					setFieldType('text'),
					setFieldDefault('value')
				)
			),
			addModel({ id: 'team' })(
				addModelField({ id: 'name' })(
					setFieldAsKey(),
					setFieldType('text'),
					setFieldDefault('value')
				)
			)
		)

		expect(context.server.services.model.models).toMatchObject({
			user: {
				id: 'user',
				fields: {
					name: { id: 'name', default: 'value', key: true, type: 'text' }
				}
			},
			team: {
				id: 'team',
				fields: {
					name: { id: 'name', default: 'value', key: true, type: 'text' }
				}
			}
		})
	})

	it('should apply multiple models with multiple fields with mulitple field set operations', async () => {
		const context = await createServer({})(
			useModelService(),
			addModel({ id: 'user' })(
				addModelField({ id: 'name' })(
					setFieldAsKey(),
					setFieldType('text'),
					setFieldDefault('value')
				),
				addModelField({ id: 'password' })(
					setFieldType('text'),
					setFieldDefault('value')
				)
			),
			addModel({ id: 'team' })(
				addModelField({ id: 'name' })(
					setFieldAsKey(),
					setFieldType('text'),
					setFieldDefault('value')
				)
			)
		)

		expect(context.server.services.model.models).toMatchObject({
			user: {
				id: 'user',
				fields: {
					name: { id: 'name', default: 'value', key: true, type: 'text' },
					password: {
						id: 'password',
						default: 'value',
						type: 'text'
					}
				}
			},
			team: {
				id: 'team',
				fields: {
					name: { id: 'name', default: 'value', key: true, type: 'text' }
				}
			}
		})
	})
})
