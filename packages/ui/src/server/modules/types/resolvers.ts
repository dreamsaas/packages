import { GraphQLScalarType } from 'graphql'

export default {
	Any: new GraphQLScalarType({
		name: 'Any',
		description: 'Literally anything',
		serialize(value) {
			return value
		},
		parseValue(value) {
			return value
		},
		parseLiteral(ast: any) {
			return ast.value
		}
	})
}
