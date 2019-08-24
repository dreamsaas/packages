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
import gql from 'graphql-tag'

export default Vue.extend({
	data() {
		return {
			component: null
		}
	},
	methods: {
		async tryImport() {
			const response = await this.$apollo.query({
				query: gql`
					query getComponent($path: String!) {
						getComponent(path: $path)
					}
				`,
				variables: {
					path: './src/plugins/mycustomcomponent.vue'
				}
			})

			const result = new Function(`
				${response.data.getComponent}
				return lib
			`)()

			this.component = result.default
		}
	}
})
</script>
