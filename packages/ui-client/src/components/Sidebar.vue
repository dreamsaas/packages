<template>
	<aside class="w-64 bg-gray-800 shadow-lg h-full py-6 flex-none">
		<ul>
			<template v-if="$store.state.serverState.uiSettings">
				<li
					class="block border-gray-700 border-b"
					v-for="item in $store.state.serverState.uiSettings.sidebar"
					:key="item.pageId"
				>
					<button
						class="block px-6 py-3 hover:bg-gray-700 w-full text-left"
						@click="$router.push({ name: item.pageId })"
					>
						{{ item.text }}
					</button>
				</li>
			</template>
		</ul>
	</aside>
</template>
