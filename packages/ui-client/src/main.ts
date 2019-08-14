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
	const store = await storeBuilder({})
	const router = await routerBuilder({}, store)
	const { apolloProvider } = await setupGraphQL()

	new Vue({
		router,
		store,
		apolloProvider,
		render: h => h(App),
		created() {
			this.$apollo.addSmartSubscription('uiSettingsChanged', {
				query: gql`
					subscription uiSettingsChanged {
						uiSettingsChanged {
							pages {
								id
								heading
								description
							}
							sidebar {
								pageName
								text
							}
						}
					}
				`,
				result({ data: { uiSettingsChanged } }) {
					console.log(this.$router)
					if (uiSettingsChanged) {
						store.commit('uiSettings', uiSettingsChanged)
						if (uiSettingsChanged.pages.length > 0) {
							this.$router.addRoutes(
								uiSettingsChanged.pages
									.filter(
										page =>
											!this.$store.state.dynamicallyAddedroutes.includes(
												page.id
											)
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
			})
		}
	}).$mount('#app')
}

start()
