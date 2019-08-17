import Vue from 'vue'
import App from './App.vue'
import { routerBuilder } from './router'
import { storeBuilder } from './store'
import { setupGraphQL } from './plugins/graphql'
import './utils/import-global-components'
import SettingsPage from '@/views/SettingsPage.vue'
import gql from 'graphql-tag'
Vue.config.productionTip = false

const start = async () => {
	const { apolloProvider } = await setupGraphQL()
	const store = await storeBuilder({ apolloProvider })
	const router = await routerBuilder({}, store)

	new Vue({
		router,
		store,
		apolloProvider,
		render: h => h(App),
		async created() {
			const updateServerState = serverState => {
				if (serverState) {
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
										path: page.id,
										name: page.id,
										component: SettingsPage
									}
								})
						)
					}
				}
			}
			const result = await this.$apollo.query({
				query: gql`
					query serverState {
						serverState {
							config
							settings {
								id
								type
								default
								label
								description
							}
							uiSettings {
								sidebar {
									text
									pageName
								}
								pages {
									id
									heading
									description
									settings
								}
							}
						}
					}
				`
			})
			updateServerState(result.data.serverState)

			this.$apollo.addSmartSubscription('serverState', {
				query: gql`
					subscription serverState {
						serverState {
							config
							settings {
								id
								type
								default
								label
								description
							}
							uiSettings {
								sidebar {
									text
									pageName
								}
								pages {
									id
									heading
									description
									settings
								}
							}
						}
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
