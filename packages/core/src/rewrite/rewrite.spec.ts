import { createValue } from './flow/utils'
import { runNode } from './flow/runner'
import Ajv from 'ajv'
// TODO self contain transitions and nodes under unique flows.
// organize flows under an application config. Start moving to pipes if possible.

describe('rewrite', () => {
	// it('should', async () => {
	// 	runNode('doubleInst', {
	// 		number: createValue('number', 1),
	// 		text: createValue('string', 'hello')
	// 	})

	// 	await new Promise(r => setTimeout(r, 4000))
	// })
	it('should', () => {
		const ajv = new Ajv()
		var valid = ajv.validate(
			{
				type: 'object',
				properties: { value: { type: 'number' } },
				required: ['value']
			},
			{
				value: '0'
			}
		)
		if (valid) console.log('valid')
		if (!valid) console.log(ajv.errors)
	})
})
