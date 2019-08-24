<template>
	<header class="bg-gray-800 border-gray-900 border-b-2 h-16 flex justify-between px-6 items-center">
		<div>
			<h1 class="text-xl text-white">DreamSaaS</h1>
		</div>
		<div>
			<ApolloMutation
				tag="span"
				:mutation="require('@/graphql/mutations').watchServerMutation"
				v-slot="{ mutate, loading }"
			>
				<BaseButton @click="mutate()" class="mr-4" :disable="loading">Watch Server</BaseButton>
			</ApolloMutation>
			<BaseButton class="mr-4">Stop</BaseButton>
			<BaseButton class="mr-4">Reload</BaseButton>
		</div>
	</header>
</template>
