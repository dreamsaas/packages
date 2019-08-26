<template>
	<input
		type="text"
		class="text-gray-900 rounded px-3 py-1"
		:placeholder="placeholder"
		@input="e => onSettingsChange(e.target.value)"
		:value="value"
	/>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: ['value', 'placeholder'],
	methods: {
		onInput(e) {
			this.$emit('input', e.target.value)
		}
	}
})
</script>
