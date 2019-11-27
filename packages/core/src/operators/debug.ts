import { ServerContext } from '@dreamsaas/types'

export const debug = (func: Function) => (context: ServerContext) => {
	func(context)
}
