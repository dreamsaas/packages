<template>
	<div>
		<h1>{{pageSettings.heading}}</h1>
		<p>{{pageSettings.description}}</p>
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	computed: {
		pageSettings() {
			return this.$store.getters.currentPageSettings(this.$route.name)
		}
	}
})
</script>