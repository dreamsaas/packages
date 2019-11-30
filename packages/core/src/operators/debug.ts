import { ServerContext } from '@dreamsaas/types'

export const debug = (func?: Function) => (context: ServerContext) => {
	if (func) {
		func(context)
	} else {
		console.log(context)
	}
}
