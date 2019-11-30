import { invertedPipe, pipe } from './utils'
import { Server, ServerContext } from '@dreamsaas/types'
import { usePlugins } from './operators/plugin'
import { applyConfig } from './operators/config'
import { convertToServerContext } from './operators/context'
import { useActions } from './operators/actions'
import { useServices } from './operators/services'

export const createServer = (server: Server = {}) => {
	// Core server includes base operators and plugins
	const coreServer = pipe(
		convertToServerContext(),
		applyConfig({}),
		useServices(),
		usePlugins(),
		useActions()
	)(server)

	// Use inverted pipe to allow chaining on response
	return invertedPipe(coreServer)
}
