import { openBranch, closeBranch } from './branch'
import { pipe } from '../utils'

describe('branch', () => {
	it('should open branch', () => {
		const opened = openBranch(
			(value: any) => ({ key1: value.key1 }),
			(value: any) => ({ value })
		)({ key1: 1, key2: 2 })

		expect(opened).toMatchObject({ key1: 1, value: { key1: 1, key2: 2 } })
	})

	it('should open branch in pipe', async () => {
		const branchOperator = openBranch(
			(value: any) => ({ key1: value.key1 }),
			(value: any) => ({ value })
		)

		const opened = await pipe(branchOperator)({ key1: 1, key2: 2 })

		expect(opened).toMatchObject({ key1: 1, value: { key1: 1, key2: 2 } })
	})

	it('should close branch', () => {
		const closed = closeBranch('value')({
			key1: 1,
			value: { key1: 1, key2: 2 }
		})

		expect(closed).toMatchObject({ key1: 1, key2: 2 })
	})

	it('should close branch with function', () => {
		const closed = closeBranch((value: any) => value.value)({
			key1: 1,
			value: { key1: 1, key2: 2 }
		})

		expect(closed).toMatchObject({ key1: 1, key2: 2 })
	})

	it('should open and close branch in pipe', async () => {
		const openOperator = openBranch(
			(value: any) => ({ key1: value.key1 }),
			(value: any) => ({ value })
		)

		const closeOperator = closeBranch((value: any) => value.value)

		const openAndClosed = await pipe(
			openOperator,
			closeOperator
		)({ key1: 1, key2: 2 })

		expect(openAndClosed).toMatchObject({ key1: 1, key2: 2 })
	})
})
