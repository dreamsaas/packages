import Vue from 'vue'
import { getApolloProvider as getApollo } from '@/plugins/graphql'
import gql from 'graphql-tag'

export const loadComponent = async (
	component: { path: string; name?: string },
	registerglobally = false
) => {
	const apollo = getApollo()
	try {
		const response = await apollo.apolloProvider.defaultClient.query({
			query: gql`
				query getComponent($path: String!) {
					getComponent(path: $path)
				}
			`,
			variables: {
				path: component.path
			}
		})

		const { default: componentCode } = new Function(`
            ${response.data.getComponent}
            return lib
        `)()

		if (registerglobally) {
			Vue.component(component.name || componentCode.name, componentCode)
		}

		return componentCode
	} catch (e) {
		console.error(`Could not load component ${component.path}`)
		console.error(e)
		return null
	}
}
