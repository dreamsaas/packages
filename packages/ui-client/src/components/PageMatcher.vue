<template>
	<div :is="$store.state.currentPageComponent" :key="$route.fullPath"></div>
</template>