<template>
	<div v-if="pageSettings">
		<BaseHeading v-if="pageSettings.heading">{{
			pageSettings.heading
		}}</BaseHeading>
		<p v-if="pageSettings.description" class="pb-3">
			{{ pageSettings.description }}
		</p>

		<div v-if="pageSettings.settings">
			<div
				v-for="settingId in pageSettings.settings"
				:key="settingId"
				class="pb-4"
			>
				<label class="text-lg font-semibold block pb-2">
					{{ settingConfiguration(settingId).label }}</label
				>
				<p class="pb-4">{{ settingConfiguration(settingId).description }}</p>
				<input
					type="text"
					@input="e => onSettingsChange(e.target.value, settingId)"
					class="text-gray-900 rounded px-3 py-1"
					:value="$store.state.config.settings[settingId]"
				/>
			</div>
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
