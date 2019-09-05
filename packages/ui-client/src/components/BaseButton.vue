<template>
	<button
		@click="e => $emit('click', e)"
		class="bg-teal-700 px-3 py-1 rounded shadow"
	>
		<slot />
	</button>
</template>
