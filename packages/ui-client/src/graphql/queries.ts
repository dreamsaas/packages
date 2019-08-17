import {
	VueApolloQueryOptions,
	VueApolloMutationOptions
} from 'vue-apollo/types/options'
import gql from 'graphql-tag'

export const watchMutation: VueApolloMutationOptions<any, any> = {
	mutation: gql`
		mutation watch {
			watch
		}
	`
}
