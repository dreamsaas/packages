import Vue from 'vue'
import App from './App.vue'
import { routerBuilder } from './router'
import { storeBuilder } from './store'
import { setupGraphQL } from './plugins/graphql'
import './utils/import-global-components'
Vue.config.productionTip = false

const start = async () => {
  const store = await storeBuilder({})
  const router = await routerBuilder({}, store)
  const { apolloProvider } = await setupGraphQL()

  new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
  }).$mount('#app')
}

start()
