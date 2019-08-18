<template>
	<div>
		<label class="text-lg font-semibold block text-gray-200">
			{{ settingConfig.label }}</label
		>
		<p class="pb-2 text-gray-400">{{ settingConfig.description }}</p>
		<input
			v-if="settingConfig.type === 'string'"
			type="text"
			class="text-gray-900 rounded px-3 py-1"
			@input="e => onSettingsChange(e.target.value)"
			:value="$store.state.config.settings[settingConfig.id]"
		/>
		<select
			v-if="settingConfig.type === 'choice'"
			@input="e => onSettingsChange(e.target.value)"
			:value="$store.state.config.settings[settingConfig.id]"
			class="text-gray-900 px-3 py-1 rounded"
		>
			<option
				v-for="choice in settingConfig.choices"
				:key="choice"
				:value="choice"
				class="text-gray-900"
			>
				{{ choice }}
			</option>
		</select>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { SettingConfiguration } from '@dreamsaas/types'
export default Vue.extend({
	props: {
		settingConfig: Object as () => SettingConfiguration
	},
	methods: {
		onSettingsChange(value) {
			console.log(value)
			this.$store.commit('setSetting', {
				id: this.settingConfig.id,
				data: value
			})
		}
	}
})
</script>
