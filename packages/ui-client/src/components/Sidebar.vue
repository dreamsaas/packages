<template>
	<aside class="w-64 bg-gray-800 shadow-lg h-full p-6 flex-none">
		<ul>
			<li>
				<button>Plugins</button>
			</li>
			<template v-if="$store.state.serverState.uiSettings">
				<li
					v-for="item in $store.state.serverState.uiSettings.sidebar"
					:key="item.pageName"
				>
					<button @click="$router.push({ name: item.pageName })">
						{{ item.text }}
					</button>
				</li>
			</template>
		</ul>
	</aside>
</template>
