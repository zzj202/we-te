<template>
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <div v-if="mainStore.userBrowser === 'WeChat'">
            <!--1-->
            <WeChatDataShowTable :data="gameStore.currentSession.numbers"></WeChatDataShowTable>
        </div>

        <div v-else>
            <!--2-->
            <OtherDataShowTable :data="gameStore.currentSession.numbers"></OtherDataShowTable>
        </div>

    </div>

</template>

<script setup>
import OtherDataShowTable from '~/components/table/OtherDataShowTable.vue';
import WeChatDataShowTable from '~/components/table/WeChatDataShowTable.vue';


const gameStore = useGameStore()
const mainStore = useMainStore()
</script>