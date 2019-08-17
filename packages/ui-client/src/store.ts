import Vue from 'vue'
import Vuex from 'vuex'
import Home from '@/views/Home.vue'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'
// import { UIConfig } from './example-config';

Vue.use(Vuex)

export const storeBuilder = async ({
	apolloProvider
}: {
	apolloProvider: VueApollo
}) => {
	return new Vuex.Store({
		state: {
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
