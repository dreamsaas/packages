import { ApolloServer } from 'apollo-server'
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
		playground: true
	})

	await server.listen(3003)

	console.log(`LISTENING ON: http://localhost:3003/graphql`)

	return { server }
}

run()
