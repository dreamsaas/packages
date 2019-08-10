<template>
	<div class="flex flex-wrap justify-left">
		<!-- <div
            v-for="plugin in hooks"
            :key="plugin"
            class="inline-block bg-gray-700 rounded-lg py-4 px-10 shadow-lg m-2"
        >
            <h1 class="text-2xl mb-2">{{plugin}}</h1>
            <p class="mb-3">this is test content</p>
            <input
                type="text"
                placeholder="Input something"
                class="block mb-4 rounded px-4 py-2 text-gray-700"
            />
             <button
                @click="refreshServer"
                class="bg-teal-600 px-6 py-1 rounded shadow-md animate hover:bg-white hover:text-teal-600 cursor-pointer"
            >Button</button>
		</div>-->
	</div>
</template>
<script lang="ts">
import gql from 'graphql-tag'
import { hooks, watchMutation } from '../graphql/queries'

export default {
	// apollo: {
	//     hooks
	// },
	// data() {
	//     return {
	//         hooks: []
	//     };
	// },
	// methods: {
	//     refreshServer() {
	//         //@ts-ignore
	//         this.$apollo.mutate(watchMutation);
	//     }
	// }
}
</script>


