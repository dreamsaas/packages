// import { generateModelGraphQLTypes } from './generators/graphql.types'
// import { ModelSchema, Model } from './types'

// const { ApolloServer, gql } = require('apollo-server')

// interface ModelService {
//   [key: string]: Model
// }

// export const startGraphQL = (
//   modelsConfig: ModelSchema[],
//   models: ModelService
// ) => {
//   const generatedTypes = generateModelGraphQLTypes(modelsConfig)
//   const typeDefs = gql(generatedTypes)

//   // Resolvers define the technique for fetching the types in the
//   // schema.  We'll retrieve books from the "books" array above.
//   const generatedQueries = {
//     ...Object.assign(
//       {},
//       ...modelsConfig.map(model => {
//         return {
//           async [model.pluralName]() {
//             return await models[`${model.typeName}Model`].find()
//           }
//         }
//       })
//     )
//   }

//   const generatedMutations = {
//     ...Object.assign(
//       {},
//       ...modelsConfig.map(model => {
//         return {
//           async [`add_${model.pluralName}`](_, args) {
//             const data = args.data
//             console.log(args)
//             return await models[`${model.typeName}Model`].create(data)
//           }
//         }
//       })
//     )
//   }

//   const resolvers = {
//     Query: generatedQueries,
//     Mutation: generatedMutations
//   }

//   // In the most basic sense, the ApolloServer can be started
//   // by passing type definitions (typeDefs) and the resolvers
//   // responsible for fetching the data for those types.
//   const server = new ApolloServer({ typeDefs, resolvers })

//   // This `listen` method launches a web-server.  Existing apps
//   // can utilize middleware options, which we'll discuss later.
//   server.listen().then(({ url }) => {
//     console.log(`🚀  Server ready at ${url}`)
//   })
// }
