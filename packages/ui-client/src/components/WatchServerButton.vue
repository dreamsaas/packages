<template>
	<button @click="startWatch">Watch server</button>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import {watchMutation} from '../graphql/queries'
export default {
	methods: {
		startWatch() {
			this.$apollo.mutate(watchMutation)
		}
	}
}
</script>