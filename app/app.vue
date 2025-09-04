<template>
  <ClientOnly>
    <NuxtLayout>

      <NuxtPage />

    </NuxtLayout>
  </ClientOnly>

</template>

<script setup lang="ts">


const gameStore = useGameStore()
onMounted(async () => {
  await gameStore.loadSessions()
})

</script>
<style>
body {
  transition: background-color .25s, color .25s;
  color: var(--color-text);
  background-color: var(--color-body);
  color-scheme: var(--color-scheme);
  margin: 0;
}
</style>
