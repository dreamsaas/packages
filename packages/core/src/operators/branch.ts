export type BranchFunction = <T>(value: T) => { [key: string]: T }

export const openBranch = (val1: BranchFunction, val2: BranchFunction) => (
	src: any
) => {
	return { ...val1(src), ...val2(src) }
}

export const closeBranch = (resultKey: string | Function) => <
	T extends { [key: string]: any }
>(
	value: T
) => {
	if (typeof resultKey === 'function') {
		return resultKey(value)
	}
	return value[resultKey]
}
