<template>
	<ApolloMutation
		tag="span"
		:mutation="require('@/graphql/mutations').watchServerMutation"
		v-slot="slotProps"
	>
		<slot v-bind="slotProps"></slot>
	</ApolloMutation>
</template>