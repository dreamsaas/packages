import {
	VueApolloQueryOptions,
	VueApolloMutationOptions
} from 'vue-apollo/types/options'
import gql from 'graphql-tag'

export const hooks: VueApolloQueryOptions<any, any> = {
	query: gql`
		query hooks {
			hooks
		}
	`,
	subscribeToMore: {
		document: gql`
			subscription hooksChanged {
				hooksChanged
			}
		`,
		updateQuery(previous, { subscriptionData: { data } }) {
			console.log(previous, data)
			return { hooks: data.hooksChanged }
		}
	}
}

export const uiSettings: VueApolloQueryOptions<any, any> = {
	query: gql`
		query hooks {
			hooks
		}
	`,
	subscribeToMore: {
		document: gql`
			subscription hooksChanged {
				hooksChanged
			}
		`,
		updateQuery(previous, { subscriptionData: { data } }) {
			console.log(previous, data)
			return { hooks: data.hooksChanged }
		}
	}
}

export const watchMutation: VueApolloMutationOptions<any, any> = {
	mutation: gql`
		mutation watch {
			watch
		}
	`
}
