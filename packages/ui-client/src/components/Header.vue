<template>
	<header class="bg-gray-800 border-gray-900 border-b-2 h-16 flex justify-between px-6 items-center">
		<div>
			<h1 class="text-xl text-white">DreamSaaS</h1>
		</div>
		<div>
			<ApolloMutation
				tag="span"
				:mutation="require('@/graphql/mutations').watchServerMutation"
				v-slot="{ mutate, loading }"
			>
				<BaseButton @click="mutate()" class="mr-4" :disable="loading">Watch Server</BaseButton>
			</ApolloMutation>
			<BaseButton class="mr-4">Stop</BaseButton>
			<BaseButton class="mr-4">Reload</BaseButton>
			<BaseButton class="mr-4" @click="tryImport">get component</BaseButton>
			<div v-if="component" :is="component" />
		</div>
	</header>
</template>
<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
export default Vue.extend({
	data() {
		return {
			component: null
		}
	},
	methods: {
		async tryImport() {
			// require('systemjs/dist/system')
			// //@ts-ignore
			// const imported = await window['System'].import(
			// 	/* webpackIgnore:true */ `http://localhost:3003/get-component`
			// )
			// const imported = await import(
			// 	//@ts-ignore
			// 	/* webpackIgnore:true */ `http://localhost:3003/get-component`
			// )

			// console.log(imported)
			const response = await axios.get(`http://localhost:3003/get-component`)
			// console.log(response.data)
			const result = new Function(`
				${response.data}
				return lib
			`)()
			this.component = result.default
			// result.default()
			console.log(result)
		}
	}
})
</script>
