import { invertedPipe, pipe } from './utils'
import { Server, ServerContext } from '@dreamsaas/types'
import { usePlugins } from './operators/plugin'
import { applyConfig } from './operators/config'
import { convertToServerContext } from './operators/context'
import { useActions } from './operators/actions'
import { useServices } from './operators/services'

export const createServer = (server: Server = {}) => (...funcs: Function[]) =>
	pipe(
		convertToServerContext(),
		applyConfig({}),
		useServices(),
		usePlugins(),
		useActions(),
		...funcs
	)(server)
