import Vue from 'vue'
import Vuex from 'vuex'
import Home from '@/views/Home.vue'
// import { UIConfig } from './example-config';

Vue.use(Vuex)

export const storeBuilder = async (config: any) => {
	return new Vuex.Store({
		state: {
			uiSettings: {
				pages: [],
				sidebar: []
			},
			dynamicallyAddedroutes: []
		},
		getters: {
			currentPageSettings(state) {
				return pageId =>
					state.uiSettings.pages.find((page: any) => page.id === pageId)
			}
		},
		mutations: {
			uiSettings(state, value) {
				state.uiSettings = value
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
			async getConfig({ commit, state }) {},
			async startServer({ commit, state }) {},
			async saveConfig({ commit, state }) {}
		}
	})
}
