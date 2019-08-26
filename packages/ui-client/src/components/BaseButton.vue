<template>
	<button
		@click="e => $emit('click', e)"
		class="bg-teal-700 px-4 py-2 rounded shadow"
	>
		<slot />
	</button>
</template>
