<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>

</template>

<script setup lang="ts">

import { createDiscreteApi } from 'naive-ui'

const gameStore = useGameStore()
const mainStore = useMainStore()
onMounted(async () => {
  await gameStore.loadSessions()
  if (process.client) {
    const userAgent = navigator.userAgent;
    // 判断浏览器类型
    if (userAgent.includes('WeChat')) {
      mainStore.setUserBroswer('WeChat')
    } else if (userAgent.includes('Chrome')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('Safari')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('Edge')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
      mainStore.setUserBroswer('Firefox')
    } else if (userAgent.includes('Firefox')) {
      mainStore.setUserBroswer('Firefox')
    }
  }
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
