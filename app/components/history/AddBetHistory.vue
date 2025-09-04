<template>
    <div class="bet-history-container">
        <div class="history-header">
            <h3 class="history-title">
                <svg class="icon" viewBox="0 0 24 24">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
                投注记录
                <span class="record-count" v-if="betRecords.length > 0">(共{{ betRecords.length }}条)</span>
            </h3>
            <div class="header-actions">
                <div class="search-control">
                    <input v-model="searchKeyword" type="text" placeholder="搜索原输入..." class="search-input"
                        @keyup.enter="applySearch" />
                    <button class="search-btn" @click="applySearch">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path
                                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </button>
                </div>
                <div class="filter-control">
                    <select v-model="filterType" class="filter-select">
                        <option value="all">全部玩法</option>
                        <option value="波色">波色</option>
                        <option value="单双">单双</option>
                        <option value="大小">大小</option>
                        <option value="包头">包头</option>
                        <option value="包尾">包尾</option>
                        <option value="包肖">包肖</option>
                        <option value="直选">直选</option>
                    </select>
                </div>
                <button class="refresh-btn" @click="refreshRecords" title="刷新">
                    <svg class="icon" viewBox="0 0 24 24">
                        <path
                            d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="loading-overlay" v-if="loading">
            <div class="loading-spinner"></div>
        </div>

        <div class="table-container">
            <table class="bet-history-table" v-if="filteredRecords.length > 0">
                <thead>
                    <tr>
                        <th class="col-index">序号</th>
                        <th class="col-type">玩法</th>
                        <th class="col-numbers">号码</th>
                        <th class="col-total">总金额</th>
                        <th class="col-amount">单注金额</th>
                        <th class="col-count">数量</th>
                        <th class="col-time">时间</th>
                        <th class="col-actions">操作</th>
                        <th class="col-count">原输入</th>
                        <th class="col-count">描述</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in filteredRecords" :key="record.id"
                        :class="{ 'new-record': isNewRecord(record.timestamp) }">
                        <td class="col-index">{{ index + 1 }}</td>
                        <td class="col-type">
                            <span class="type-badge" :class="getTypeClass(record.type)">{{ record.type }}</span>
                        </td>
                        <td class="col-numbers">
                            <div class="number-balls">
                                <span v-for="(num, i) in record.numbers" :key="i" class="ball">{{ num }}</span>
                            </div>
                        </td>
                        <td class="col-total">
                            <span class="total-amount-value">¥{{ (record.amount * record.numbers.length)
                            }}</span>
                        </td>
                        <td class="col-amount">
                            <span class="amount-value">¥{{ record.amount }}</span>
                        </td>
                        <td class="col-count">
                            <span class="count-value">{{ record.numbers.length }}</span>
                        </td>

                        <td class="col-time" :title="formatFullTime(record.timestamp)">
                            <svg class="icon clock-icon" viewBox="0 0 24 24">
                                <path
                                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                            {{ formatRelativeTime(record.timestamp) }}
                        </td>
                        <td class="col-actions">
                            <button class="action-btn delete-btn" @click="confirmDelete(record)" title="删除">
                                <svg class="icon" viewBox="0 0 24 24">
                                    <path
                                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                </svg>
                            </button>
                        </td>

                        <td>
                            <span>{{ record.inputValue }}</span>
                        </td>
                        <td>
                            <span>{{ record.description }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="empty-state" v-else>
                <svg class="icon empty-icon" viewBox="0 0 24 24">
                    <path
                        d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z" />
                </svg>
                <p v-if="loading">正在加载数据...</p>
                <p v-else>没有找到匹配的记录</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { createDiscreteApi } from 'naive-ui'

const { dialog, message, loadingBar } = createDiscreteApi(
    ['dialog', 'message', 'loadingBar']
)
// 扩展dayjs插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 设置为中文

const gameStore = useGameStore()
const betRecords = ref([])
const lastRefreshTime = ref(dayjs())
const loading = ref(false)
const filterType = ref('all')
const searchKeyword = ref('')

const emit = defineEmits(['delete-record', 'refresh-records'])

// 计算属性：过滤后的记录
const filteredRecords = computed(() => {
    let records = betRecords.value

    // 先按玩法类型过滤
    if (filterType.value !== 'all') {
        records = records.filter(record => record.type === filterType.value)
    }

    // 再按关键字搜索
    if (searchKeyword.value.trim()) {
        const keyword = searchKeyword.value.trim().toLowerCase()
        records = records.filter(record =>
            record.inputValue && record.inputValue.toLowerCase().includes(keyword)
        )
    }

    return records
})

onMounted(async () => {
    await loadRecords()
})

const loadRecords = async () => {
    try {
        loading.value = true
        await gameStore.loadSessions()
        betRecords.value = gameStore.currentSession.betRecords || []

        lastRefreshTime.value = dayjs()
    } catch (error) {
        console.error('加载投注记录失败:', error)
    } finally {
        loading.value = false
    }
}

const refreshRecords = async () => {
    await loadRecords()
    emit('refresh-records')
}

const applySearch = () => {
    // 搜索逻辑已经在计算属性中实现
    // 这里只是提供一个明确的搜索触发点
}

// 检查是否为新记录（5分钟内）
const isNewRecord = (timestamp) => {
    return dayjs(timestamp).isAfter(dayjs().subtract(5, 'minute'))
}

// 根据玩法类型获取样式类
const getTypeClass = (type) => {
    const typeMap = {
        '单双': 'type-primary',
        '波色': 'type-warning',
        '包头尾': 'type-success',
        
        '包肖': 'type-danger',
        '直选': 'type-info'
    }
    return typeMap[type] || 'type-default'
}

// 格式化完整时间（用于title提示）
const formatFullTime = (timestamp) => {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化相对时间（显示与当前时间的相对关系）
const formatRelativeTime = (timestamp) => {
    return dayjs(timestamp).fromNow()
}

const confirmDelete = async (record) => {
    dialog.warning({
        title: '撤销投注',
        content: '你确定要撤销？',
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: () => {
            gameStore.cancelBet(record)
        },
        onNegativeClick: () => {
            message.warning('取消')
        }
    })
}
</script>

<style scoped lang="scss">
/* 新增搜索相关样式 */
.search-control {
    position: relative;
    display: flex;
    align-items: center;
    width: 200px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    overflow: hidden;
    background-color: #f9f9f9;
    transition: all 0.2s;

    &:hover {
        border-color: #c0c0c0;
    }

    &:focus-within {
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
}

.search-input {
    flex: 1;
    padding: 6px 12px;
    border: none;
    background: transparent;
    font-size: 13px;
    color: #333;
    outline: none;

    &::placeholder {
        color: #999;
    }
}

.search-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;

    .icon {
        width: 16px;
        height: 16px;
        fill: #666;
    }

    &:hover {
        .icon {
            fill: #1890ff;
        }
    }
}

/* 调整header-actions布局 */
.header-actions {
    display: flex;
    align-items: center;
    gap: 10px;

    >* {
        flex-shrink: 0;
    }
}

/* 其他原有样式保持不变 */
.bet-history-container {
    margin: 16px;
    padding: 16px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    font-size: 14px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.history-title {
    display: flex;
    align-items: center;
    color: #333;
    margin: 0;
    font-size: 16px;
    font-weight: 600;

    .icon {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        fill: #1890ff;
    }
}

.record-count {
    margin-left: 8px;
    font-size: 13px;
    color: #999;
    font-weight: normal;
}

.filter-control {
    position: relative;

    &::after {
        content: "▼";
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 10px;
        color: #666;
        pointer-events: none;
    }
}

.filter-select {
    appearance: none;
    padding: 6px 30px 6px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    background-color: #f9f9f9;
    font-size: 13px;
    color: #333;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: #c0c0c0;
    }

    &:focus {
        outline: none;
        border-color: #1890ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
}

.refresh-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #f5f5f5;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    .icon {
        width: 16px;
        height: 16px;
        fill: #666;
        transition: transform 0.3s;
    }

    &:hover {
        background-color: #e6f7ff;

        .icon {
            fill: #1890ff;
            transform: rotate(360deg);
        }
    }
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 12px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1890ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.table-container {
    overflow-x: auto;
    border-radius: 8px;
    position: relative;
}

.bet-history-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background-color: white;
    font-size: 14px;
    border-radius: 8px;
    overflow: hidden;

    thead {
        background: linear-gradient(to right, #fafafa, #f0f0f0);
    }

    th {
        font-weight: 600;
        color: #666;
        white-space: nowrap;
        padding: 12px 16px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
        position: sticky;
        top: 0;
        z-index: 2;
    }

    td {
        padding: 10px 16px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s;
    }

    tr {
        &:hover {
            background-color: rgba(24, 144, 255, 0.03);
        }

        &.new-record {
            background-color: rgba(24, 144, 255, 0.05);
            animation: fadeIn 0.5s ease;
        }
    }

    @keyframes fadeIn {
        from {
            background-color: rgba(24, 144, 255, 0.2);
        }

        to {
            background-color: rgba(24, 144, 255, 0.05);
        }
    }
}

.icon {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    fill: currentColor;
}

.clock-icon {
    fill: #999;
    margin-right: 6px;
}

.type-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &.type-primary {
        background: linear-gradient(to right, #e6f7ff, #bae7ff);
        color: #096dd9;
        border: 1px solid #91d5ff;
    }

    &.type-success {
        background: linear-gradient(to right, #f6ffed, #d9f7be);
        color: #389e0d;
        border: 1px solid #b7eb8f;
    }

    &.type-warning {
        background: linear-gradient(to right, #fffbe6, #ffe58f);
        color: #d48806;
        border: 1px solid #ffd666;
    }

    &.type-danger {
        background: linear-gradient(to right, #fff1f0, #ffccc7);
        color: #cf1322;
        border: 1px solid #ffa39e;
    }

    &.type-info {
        background: linear-gradient(to right, #f0f5ff, #d6e4ff);
        color: #1d39c4;
        border: 1px solid #adc6ff;
    }

    &.type-default {
        background: linear-gradient(to right, #fafafa, #f0f0f0);
        color: #666;
        border: 1px solid #d9d9d9;
    }
}

.number-balls {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;

    .ball {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: linear-gradient(135deg, #1890ff, #096dd9);
        color: white;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;

        &:hover {
            transform: scale(1.1);
        }
    }
}

.count-value {
    color: #666;
    font-weight: 500;
}

.total-amount-value {
    font-weight: 700;
    color: #ff4d4f;
    font-size: 14px;
}

.amount-value {
    font-weight: 600;
    color: #ff9901;
    font-size: 14px;
}

.col-time {
    color: #666;
    white-space: nowrap;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    .icon {
        width: 16px;
        height: 16px;
    }

    &:hover {
        background-color: #f5f5f5;
        transform: scale(1.1);
    }

    &.delete-btn:hover {
        color: #ff4d4f;
        background-color: #fff1f0;
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    text-align: center;
    min-height: 200px;

    .empty-icon {
        width: 48px;
        height: 48px;
        fill: #d9d9d9;
        margin-bottom: 16px;
        opacity: 0.6;
    }

    p {
        color: #999;
        margin-bottom: 20px;
        font-size: 14px;
    }
}

.primary-btn {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background: linear-gradient(to right, #1890ff, #096dd9);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);

    .icon {
        width: 14px;
        height: 14px;
        fill: white;
    }

    &:hover {
        background: linear-gradient(to right, #40a9ff, #1890ff);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    }

    &:active {
        transform: translateY(0);
    }
}

@media (max-width: 1200px) {
    .search-control {
        display: none;
    }
}

@media (max-width: 768px) {
    .search-control {
        display: flex;
    }

    .filter-control {
        display: flex;
    }

    .bet-history-container {
        margin: 12px;
        padding: 12px;
    }

    .history-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .header-actions {
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .search-control {
        width: 100%;
        order: 1;
    }

    .filter-control {
        order: 2;
    }

    .refresh-btn {
        order: 3;
    }

    .filter-select {
        width: 100%;
    }

    .bet-history-table {

        th,
        td {
            padding: 8px 12px;
            font-size: 13px;
        }

        .number-balls .ball {
            width: 22px;
            height: 22px;
        }
    }
}

@media (max-width: 480px) {
    .search-control {
        display: none;
    }

    .filter-control {
        display: flex;
    }

    .bet-history-container {
        margin: 8px;
        padding: 10px;
    }

    .bet-history-table {
        .col-type {
            display: none;
        }

        .col-time {
            font-size: 12px;
        }
    }

    .empty-state {
        padding: 30px 12px;

        .empty-icon {
            width: 40px;
            height: 40px;
        }
    }
}
</style>