import gql from 'graphql-tag'
import Vue from 'vue'
import { ApolloProvider } from 'vue-apollo'
import Vuex from 'vuex'
// import { UIConfig } from './example-config';

Vue.use(Vuex)

export const storeBuilder = async ({
	apolloProvider
}: {
	apolloProvider: ApolloProvider
}) => {
	return new Vuex.Store({
		state: {
			loading: true,
			config: {
				settings: {}
			},
			serverState: {
				uiSettings: {
					pages: [],
					sidebar: []
				},
				settings: [],
				config: {},
				plugins: []
			},
			dynamicallyAddedroutes: []
		},
		getters: {
			currentPageSettings(state) {
				return pageId =>
					state.serverState.uiSettings.pages.find(
						(page: any) => page.id === pageId
					)
			},
			settingConfiguration(state) {
				return settingId =>
					state.serverState.settings.find(
						(setting: any) => setting.id === settingId
					)
			}
		},
		mutations: {
			config(state, config: any) {
				state.config = config
			},
			loading(state, value) {
				state.loading = value
			},
			setSetting(state, value: { id: string; data: any }) {
				if (!state.config.settings) state.config.settings = {}
				state.config.settings[value.id] = value.data
			},
			serverState(state, value) {
				state.config = JSON.parse(JSON.stringify(value.config))
				state.serverState = value
			},
			addRoute(state, value) {
				//@ts-ignore
				if (!state.dynamicallyAddedroutes.includes(value.id)) {
					//@ts-ignore
					state.dynamicallyAddedroutes.push(value.id)
				}
			}
		},
		actions: {
			async saveConfig({ commit, state }) {
				apolloProvider.defaultClient.mutate({
					mutation: gql`
						mutation saveConfig($config: String!) {
							saveConfig(config: $config)
						}
					`,
					variables: {
						config: JSON.stringify(state.config)
					}
				})
			}
		}
	})
}
