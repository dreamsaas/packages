import { ApolloServer } from 'apollo-server'
import { generateSchema } from './utils/generate-schema'

export const run = async () => {
	const server = new ApolloServer({
		schema: generateSchema(),
		playground: true
	})

	await server.listen(3003)

	console.log(`LISTENING ON: http://localhost:3003/graphql`)

	return { server }
}

run()
