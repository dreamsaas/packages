<template>
	<select
		@input="onInput"
		:value="value"
		style="border-bottom: 1px solid white"
		class="text-gray-900 px-3 py-1 rounded"
	>
		<option
			v-for="choice in choices"
			:key="choice"
			:value="choice"
			class="text-gray-900"
		>
			{{ choice }}
		</option>
	</select>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: ['value', 'choices'],
	methods: {
		onInput(e) {
			this.$emit('input', e.target.value)
		}
	}
})
</script>
