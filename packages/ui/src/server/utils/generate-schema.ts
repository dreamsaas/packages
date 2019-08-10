import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import * as path from 'path'

export const generateSchema = () => {
	const pathToModules = path.join(__dirname, '../modules')

	const graphqlTypes = fileLoader(`${pathToModules}/**/*.graphql`)
	const resolverFiles = fileLoader(`${pathToModules}/**/resolvers.ts`)

	return makeExecutableSchema({
		typeDefs: mergeTypes(graphqlTypes, { all: true }),
		resolvers: mergeResolvers(resolverFiles)
	})
}
