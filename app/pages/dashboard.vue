<template>
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <OtherDataShowTable :data="gameStore.currentSession.numbers"></OtherDataShowTable>
        <!-- <div v-if="mainStore.userBrowser === 'WeChat'">
            <WeChatDataShowTable :data="gameStore.currentSession.numbers"></WeChatDataShowTable>
        </div>
        <div v-else>
            <OtherDataShowTable :data="gameStore.currentSession.numbers"></OtherDataShowTable>
        </div> -->

    </div>

</template>

<script setup>
import OtherDataShowTable from '~/components/table/OtherDataShowTable.vue';
import WeChatDataShowTable from '~/components/table/WeChatDataShowTable.vue';

import { createDiscreteApi } from 'naive-ui'

const { dialog, message, loadingBar } = createDiscreteApi(
    ['dialog', 'message', 'loadingBar']
)

const gameStore = useGameStore()
const mainStore = useMainStore()


onMounted(() => {
    const route = useRoute()
    // 获取查询参数 (如 ?search=xxx)
    const sessionId = route.query.sessionId
    console.log(sessionId)
    if (sessionId) {
        gameStore.setCurrentSession(sessionId).then(() => {
            console.log('场次切换')
        }).catch(() => {
            message.error('场次不存在，请手动切换')
        })
    }

})

</script>