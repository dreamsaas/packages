import express from 'express'
import http from 'http'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { generateSchema } from './utils/generate-schema'
import { setProjectLocation } from './modules/project-manager'
import * as path from 'path'

export const run = async () => {
	const projectLocation = setProjectLocation(
		path.resolve(__dirname, '../../../playground')
	)

	console.log('Starting at project location', projectLocation)
	const server = new ApolloServer({
		schema: generateSchema(),
		playground: {
			title:'DreamSaaS Admin',
			settings:{
				"general.betaUpdates":true,
			},
			workspaceName:'DreamSaaS'
		},
		tracing:true
	})

	const app = express()
	app.use(cors({}))

	server.applyMiddleware({ app })

	const httpServer = http.createServer(app)
	server.installSubscriptionHandlers(httpServer)

	await httpServer.listen(3003)
	console.log(`LISTENING ON: http://localhost:3003${server.graphqlPath}`)

	return { server }
}

run()
