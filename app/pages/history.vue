<template>
    <div class="operation-records-container">
        <h3 class="records-title">操作记录</h3>
        <div v-if="operationRecords.length === 0" class="empty-records">
            暂无操作记录
        </div>
        <ul v-else class="records-list">
            <li v-for="record in operationRecords" :key="record.id" class="record-item">
                <div class="record-content">
                    <span class="record-type">{{ getTypeText(record.type) }}</span>
                    <span class="record-description">{{ record.description }}</span>
                </div>
                <div class="record-time">
                    {{ formatTime(record.timestamp) }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 扩展dayjs插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 设置为中文

const gameStore = useGameStore()
const operationRecords = ref([])

onMounted(async () => {
    await loadRecords()
})

const loadRecords = async () => {
    try {
        await gameStore.loadSessions()
        operationRecords.value = gameStore.currentSession.operationRecords || []
        // 按时间倒序排列
        operationRecords.value.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    } catch (error) {
        console.error('加载操作记录失败:', error)
    }
}

const formatTime = (timestamp) => {
    const now = dayjs()
    const recordTime = dayjs(timestamp)

    // 如果是今天，显示相对时间（如：5分钟前）
    if (recordTime.isSame(now, 'day')) {
        return recordTime.fromNow()
    }
    // 如果是昨天，显示"昨天 + 时间"
    else if (recordTime.isSame(now.subtract(1, 'day'), 'day')) {
        return `昨天 ${recordTime.format('HH:mm')}`
    }
    // 其他情况显示完整日期时间
    else {
        return recordTime.format('YYYY-MM-DD HH:mm')
    }
}

const getTypeText = (type) => {
    const typeMap = {
        'ADD_BET': '加注'
    }
    return typeMap[type] || type
}
</script>

<style scoped lang="scss">
.operation-records-container {
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
    max-height: 400px;
    overflow-y: auto;
}

.records-title {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #333;
    font-weight: bold;
}

.empty-records {
    text-align: center;
    color: #999;
    padding: 20px 0;
}

.records-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.record-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;

    &:last-child {
        border-bottom: none;
    }
}

.record-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.record-type {
    background-color: #e6f7ff;
    color: #1890ff;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}

.record-description {
    color: #333;
}

.record-time {
    color: #999;
    font-size: 12px;
}
</style>