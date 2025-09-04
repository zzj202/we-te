<template>
    <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <table-phone-data-show-table :data="gameStore.currentSession.numbers"></table-phone-data-show-table>
    </div>
</template>

<script setup>

const gameStore = useGameStore()
</script>