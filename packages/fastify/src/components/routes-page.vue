<template>
	<div>
		<div class="mb-6">
			<BaseInputSelect
				:choices="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
				v-model="newRoute.method"
			/>
			<BaseInputText v-model="newRoute.url" placeholder="url" />
			<BaseButton @click="createRoute">create route</BaseButton>
		</div>
		<div class="flex">
			<div class="mb-4 mr-4">
				<div
					v-for="route in httpConfig.routes"
					:key="route.url + route.method"
					class="mb-2"
				>
					<BaseInputSelect
						:choices="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
						v-model="route.method"
					/>
					<BaseInputText v-model="route.url" placeholder="url" />
					<BaseButton @click="selected = route">Configure</BaseButton>
				</div>
			</div>
			<div v-if="selected" class="rounded bg-gray-700 p-6">
				<BaseInputSelect
					:choices="['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
					v-model="selected.method"
				/>
				<BaseInputText v-model="selected.url" placeholder="url" /><br />
				<BaseButton @click="selected = route">Delete</BaseButton>
				<h3>Hooks</h3>
				<h3>Pre</h3>
				<h3>Handler</h3>
				<BaseButton
					@click="
						selected.hooks.handler = selected.hooks.handler.concat({
							actionId: '',
							options: ''
						})
					"
					>New Action</BaseButton
				>

				<ul>
					<li v-for="(action, index) in selected.hooks.handler" :key="index">
						<BaseInputText v-model="action.actionId" placeholder="actionId" />
						<BaseInputText v-model="action.options" placeholder="options" />
					</li>
				</ul>
				<h3>Response</h3>
			</div>
		</div>

		<BaseButton @click="save">Save</BaseButton>
	</div>
</template>
<script>
export default {
	data() {
		return {
			newRoute: {
				url: '',
				method: 'GET',
				hooks: {
					pre: [],
					handler: [],
					response: []
				}
			},
			httpConfig: {},
			selected: null
		}
	},
	watch: {
		'$store.state.config': {
			immediate: true,
			handler(val) {
				this.httpConfig = val.http
				this.httpConfig.routes = this.httpConfig.routes.map(route => {
					if (!route.hooks) {
						route.hooks = {
							pre: [],
							handler: [],
							response: []
						}
					}
					return route
				})
			}
		}
	},
	methods: {
		createRoute() {
			this.httpConfig.routes.push({ ...this.newRoute })
			this.newRoute.url = ''
			this.newRoute.method = 'GET'
		},
		save() {
			this.$store.commit('config', {
				...this.$store.state.config,
				http: this.httpConfig
			})
			this.$store.dispatch('saveConfig')
		}
	}
}
</script>
