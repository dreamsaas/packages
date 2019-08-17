import { VueApolloMutationOptions } from 'vue-apollo/types/options'
import gql from 'graphql-tag'

export const startServerMutation: VueApolloMutationOptions<any, any> = {
	mutation: gql`
		mutation startServer {
			startServer
		}
	`
}

export const StopServerMutation: VueApolloMutationOptions<any, any> = {
	mutation: gql`
		mutation stopServer {
			stopServer
		}
	`
}

// export const reloadServerMuation: VueApolloMutationOptions<any, any> = {
// 	mutation: gql`
// 		mutation reloadServer {
// 			reloadServer
// 		}
// 	`
// }

export const watchServerMutation = gql`
	mutation watch {
		watch
	}
`
