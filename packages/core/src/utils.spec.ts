import {
	pipe,
	invertedPipe,
	clone,
	createState,
	merge,
	stringAccessor
} from './utils'

describe('utils', () => {
	const uppercase = (value: string) => value.toUpperCase()
	const reverse = (value: string) =>
		value
			.split('')
			.reverse()
			.join('')

	describe('pipe', () => {
		it('should return a promise', () => {
			expect(pipe()(true)).toBeInstanceOf(Promise)
		})

		it('should pass through the value', () => {
			expect(pipe()('value')).resolves.toBe('value')
		})

		it('should allow operators to change values', () => {
			expect(
				pipe(uppercase, reverse)('value')
			).resolves.toBe('EULAV')
		})

		it('should allow nested pipes', () => {
			expect(
				pipe(uppercase, reverse, pipe(reverse))('value')
			).resolves.toBe('VALUE')
		})
	})

	describe('invertedPipe', () => {
		it('should return a promise', () => {
			expect(invertedPipe(true)()).toBeInstanceOf(Promise)
		})

		it('should pass through the value', () => {
			expect(invertedPipe('value')()).resolves.toBe('value')
		})

		it('should allow operators to change values', () => {
			expect(
				invertedPipe('value')(uppercase, reverse)
			).resolves.toBe('EULAV')
		})
	})

	describe('clone', () => {
		it('Should deep clone object', () => {
			const original = { value: { nested: true } }
			expect(clone(original)).not.toBe(original)
			expect(clone(original).value).not.toBe(original.value)
		})

		it('Should clone arrays', () => {
			const original = { value: { nested: [true] } }
			expect(clone(original).value.nested).not.toBe(
				original.value.nested
			)
		})

		it('Should not clone stateful objects', () => {
			const original = {
				value: createState({ nested: true })
			}
			expect(clone(original)).not.toBe(original)
			expect(clone(original).value).toBe(original.value)
		})
	})

	describe('merge', () => {
		it('Should deep clone object', () => {
			const original = { value: { nested: true } }
			expect(merge(original, {})).not.toBe(original)
			expect(merge(original, {}).value).not.toBe(
				original.value
			)
		})

		it('Should clone arrays', () => {
			const original = { value: { nested: [true] } }
			expect(merge(original, {}).value.nested).not.toBe(
				original.value.nested
			)
		})

		it('Should not clone stateful objects', () => {
			const original = {
				value: createState({ nested: true })
			}
			expect(merge(original, {})).not.toBe(original)
			expect(merge(original, {}).value).toBe(original.value)
		})

		it('Should merge arrays', () => {
			const original = { value: { nested: [1] } }
			const change = { value: { nested: [2] } }
			expect(
				merge(original, change).value.nested
			).toMatchObject([1, 2])
		})
	})

	describe('stringAccessor', () => {
		it('Should allow string access of object', () => {
			const original = {
				value: { nested: { nested: true } }
			}

			expect(
				stringAccessor('value.nested.nested', original)
			).toBe(true)
		})

		it('Should return undefined if not found', () => {
			const original = {
				value: { nested: { nested: true } }
			}
			const value = stringAccessor(
				'fake.fake.fake',
				original
			)

			expect(value).toBeUndefined()
		})
	})
})
