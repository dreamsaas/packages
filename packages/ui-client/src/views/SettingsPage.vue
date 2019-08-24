<template>
	<div v-if="pageSettings" class="min-h-full">
		<BaseHeading v-if="pageSettings.heading">{{
			pageSettings.heading
		}}</BaseHeading>
		<p v-if="pageSettings.description" class="pb-3">
			{{ pageSettings.description }}
		</p>
		<div v-if="pageSettings.component" :is="pageSettings.component"/>
		<div v-if="pageSettings.settings">
			<SettingInput
				v-for="settingId in pageSettings.settings"
				:key="settingId"
				:settingConfig="settingConfiguration(settingId)"
				class="mb-6"
			>
			</SettingInput>
			<BaseButton @click="$store.dispatch('saveConfig')">Save</BaseButton>
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	methods: {
		onSettingsChange(value, settingId) {
			this.$store.commit('setSetting', { id: settingId, data: value })
		}
	},
	computed: {
		pageSettings() {
			return this.$store.getters.currentPageSettings(this.$route.name)
		},
		settingConfiguration() {
			return (settingId: any) =>
				this.$store.getters.settingConfiguration(settingId)
		}
	}
})
</script>
