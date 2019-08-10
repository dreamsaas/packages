import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import { UIConfig } from './example-config';
import { Store } from 'vuex'

Vue.use(Router)

export const routerBuilder = async (config: any, store: Store<any>) => {
  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
      {
        path: '/',
        name: 'home',
        component: Home
      }
    ]
  })

  return router
}
