import Vue from 'vue'
import App from './App.vue'
import { routerBuilder } from './router'
import { storeBuilder } from './store'
import { getApolloProvider } from './plugins/graphql'
import './utils/import-global-components'
import SettingsPage from '@/views/SettingsPage.vue'
import gql from 'graphql-tag'
import { loadComponent } from './services/load-component';
Vue.config.productionTip = false


const serverStateFragment = `serverState {
	config
	settings {
		id
		type
		default
		label
		description
		choices
		component
	}
	plugins{
		id
		hidden
		hooks
		version
		dependencies
		settingsUI
	}
	uiSettings {
		sidebar {
			text
			pageId
		}
		components{
			path
			name
		}
		pages {
			id
			path
			heading
			description
			settings
			component
		}
	}
}
`


const start = async () => {
	const { apolloProvider } = getApolloProvider()
	const store = await storeBuilder({ apolloProvider })
	const router = await routerBuilder({}, store)

	new Vue({
		router,
		store,
		apolloProvider,
		render: h => h(App),
		async created() {
			const updateServerState = async serverState => {
				if (serverState) {
					this.$store.commit('loading',true)
					store.commit('serverState', serverState)
					if (serverState.uiSettings.pages.length > 0) {
						this.$router.addRoutes(
							serverState.uiSettings.pages
								.filter(
									page =>
										!this.$store.state.dynamicallyAddedroutes.includes(page.id)
								)
								.map(page => {
									this.$store.commit('addRoute', page)
									return {
										path: page.path || page.id,
										name: page.id,
										component: SettingsPage
									}
								})
						)

						// Make async serial
						for(let component of serverState.uiSettings.components){
							await loadComponent(component, true)

						}
					}
					
					this.$store.commit('loading',false)
				}
			}
			const result = await this.$apollo.query({
				query: gql`
					query serverState {
						${serverStateFragment}
					}
				`
			})
			updateServerState(result.data.serverState)

			this.$apollo.addSmartSubscription('serverState', {
				query: gql`
					subscription serverState {
						${serverStateFragment}
					}
				`,
				result({ data: { serverState } }) {
					updateServerState(serverState)
				}
			})
		}
	}).$mount('#app')
}

start()
