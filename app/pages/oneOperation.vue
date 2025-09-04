<template>
    <div class="layout-container">
        <!-- 移动端优先显示 AddBetArea -->
        <div class="right-section mobile-first">
            <AddBetArea />
        </div>
        
        <div class="left-section">
            <AddBetHistory />
        </div>
        
        <!-- 桌面端显示的原顺序 -->
        <div class="right-section desktop-only">
            <AddBetArea />
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
    position: relative;
}

.left-section {
    flex: 2;
    min-width: 0; /* 防止内容溢出 */
}

.right-section {
    flex: 3;
    min-width: 0; /* 防止内容溢出 */
}

/* 移动端优先显示的 AddBetArea */
.mobile-first {
    display: none;
}

.desktop-only {
    display: block;
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
    
    /* 移动端显示顺序调整 */
    .mobile-first {
        display: block;
        order: -1; /* 放在最前面 */
    }
    
    .desktop-only {
        display: none;
    }
}
</style>