<template>
    <div id="app" class="h-screen w-screen bg-gray-900 text-white">
        <Header />
        <div class="home w-full h-full">
            <main class="flex w-full h-full">
                <Sidebar />
                <article class="p-6 h-full overflow-scroll bg-gray-900">
                    <router-view />
                </article>
            </main>
        </div>
    </div>
</template>

<style>
@tailwind base;

@tailwind components;

@tailwind utilities;
</style>
