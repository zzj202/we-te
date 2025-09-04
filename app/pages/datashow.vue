<template>
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <DataShowTable :data="gameStore.currentSession.numbers"></DataShowTable>
    </div>
</template>

<script setup>
import DataShowTable from '~/components/table/DataShowTable.vue';

const gameStore = useGameStore()
</script>