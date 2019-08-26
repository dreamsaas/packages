<template>
	<div>
		<label class="text-lg font-semibold block text-gray-200">
			{{ settingConfig.label }}</label
		>
		<p class="pb-2 text-gray-400">{{ settingConfig.description }}</p>
		<BaseInputText
			v-if="settingConfig.type === 'string'"
			:value="storeValue"
			@input="onSettingsChange"
		/>
		<BaseInputSelect
			v-if="settingConfig.type === 'choice'"
			:choices="settingConfig.choices"
			:value="storeValue"
			@input="onSettingsChange"
		/>
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
			this.$store.commit('setSetting', {
				id: this.settingConfig.id,
				data: value
			})
		}
	},
	computed: {
		storeValue() {
			return this.$store.state.config.settings[this.settingConfig.id]
		}
	}
})
</script>
