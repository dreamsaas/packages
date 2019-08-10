import Vue from 'vue'
import Vuex from 'vuex'
// import { UIConfig } from './example-config';

Vue.use(Vuex)

export const storeBuilder = async (config: any) => {
  return new Vuex.Store({
    state: {
      config
    },
    mutations: {},
    actions: {
      async getConfig({ commit, state }) {},
      async startServer({ commit, state }) {},
      async saveConfig({ commit, state }) {}
    }
  })
}
