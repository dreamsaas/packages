import Vue from 'vue'
import Router from 'vue-router'
import { Store } from 'vuex'
import PageMatcher from './components/PageMatcher.vue'
import SettingsPage from './views/SettingsPage.vue'

Vue.use(Router)

export const routerBuilder = async (config: any, store: Store<any>) => {
	const router = new Router({
		mode: 'history',
		base: process.env.BASE_URL,
		routes: [
			{
				path: '/',
				component: SettingsPage
			}
		]
	})

	return router
}
