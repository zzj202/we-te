<template>
    <div class="layout-container">
        <div class="left-section">
            <AddBetHistory></AddBetHistory>
        </div>
        <div class="right-section">
            <AddBetArea></AddBetArea>
        </div>
    </div>
</template>

<script setup>
import AddBetArea from '~/components/area/AddBetArea.vue';
import AddBetHistory from '~/components/history/AddBetHistory.vue';

</script>

<style scoped>
.layout-container {
    display: flex;
    gap: 2px;
    padding: 2px;
    max-width: 1800px;
    margin: 0 auto;
}

.left-section {
    flex: 2;
    min-width: 0;
    /* 防止内容溢出 */
}

.right-section {
    flex: 3;
    min-width: 0;
    /* 防止内容溢出 */
}

/* 响应式设计 - 在小屏幕上改为垂直布局 */
@media (max-width: 768px) {
    .layout-container {
        flex-direction: column;
    }

    .left-section,
    .right-section {
        width: 100%;
    }
}
</style>