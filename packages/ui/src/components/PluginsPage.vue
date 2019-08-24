<template>
    <div>
        <ul class="flex">
            <li v-for="plugin in plugins" :key="plugin.id" class="m-2 bg-gray-700 shadow rounded px-6 py-3 text-bold">
                <h2 class="text-lg font-semibold">{{plugin.id}}</h2>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    computed:{
        plugins(){
            return this.$store.state.serverState.plugins.filter(plugin=>!plugin.hidden)
        }
    }
}
</script>