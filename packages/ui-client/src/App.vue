<template>
	<div id="app" class="h-screen w-screen bg-gray-900 text-white flex flex-col">
		<Header />
		<main class="flex w-full h-full">
			<Sidebar />
			<article class="p-6 h-full overflow-y-auto bg-gray-900 flex-grow">
				<router-view v-if="!$store.state.loading"/>
				<div v-else>
					<h1>Loading server state</h1>
				</div>
			</article>
		</main>
	</div>
</template>

<style>
@tailwind base;

@tailwind components;

@tailwind utilities;
</style>
