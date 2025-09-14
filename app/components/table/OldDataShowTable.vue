<template>
    <div class="zodiac-container">
        <!-- 生肖总金额统计 -->
        <div class="zodiac-totals-section">
            <div class="zodiac-totals-grid">
                <div v-for="item in sortedZodiacTotals" :key="item.name" class="zodiac-total-card"
                    :style="{ backgroundColor: getZodiacColor(item.name) }">
                    <div class="zodiac-total-name">{{ item.name }}</div>
                    <div class="zodiac-total-amount">{{ formatAmount(item.total) }}</div>
                </div>
            </div>
        </div>
        <div class="zodiac-grid">
            <div v-for="item in filteredData" :key="item.number" class="zodiac-card"
                :class="[getAmountClass(item.amount)]">
                <div class="zodiac-header">
                    <span class="zodiac-number">{{ item.number }}</span>
                    <span class="zodiac-name">{{ getZodiac(item.number) }}</span>
                </div>
                <div v-if="item.amount" class="zodiac-content">
                    <div class="amount-row">
                        <span class="value">{{ formatAmount(item.amount) }}</span>
                    </div>
                </div>
                <div v-if="paoShow" class="zodiac-content">
                    <div class="amount-row">
                        <span class="pao-value">{{ formatAmount(item.amount - item.paoAmount) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const store = useMainStore()

const props = defineProps({
    paoShow: {
        type: Boolean,
        default: false
    }
})

const gameStore = useGameStore()
const numbers = computed(() => {
    return gameStore.currentSession.numbers
})

// const zodiacData = computed(() => store.currentZodiacData)

// 生肖与号码的映射关系
const zodiacNumberMap = {
    '鼠': ['06', '18', '30', '42'],
    '牛': ['05', '17', '29', '41'],
    '虎': ['04', '16', '28', '40'],
    '兔': ['03', '15', '27', '39'],
    '龙': ['02', '14', '26', '38'],
    '蛇': ['01', '13', '25', '37', '49'],
    '马': ['12', '24', '36', '48'],
    '羊': ['11', '23', '35', '47'],
    '猴': ['10', '22', '34', '46'],
    '鸡': ['09', '21', '33', '45'],
    '狗': ['08', '20', '32', '44'],
    '猪': ['07', '19', '31', '43']
}
const getZodiac = (number) => {
    const numStr = number.toString().padStart(2, '0');
    for (const [zodiac, numbers] of Object.entries(zodiacNumberMap)) {
        if (numbers.includes(numStr)) return zodiac;
    }
    return '未知';
};
// // 筛选后的数据
const filteredData = computed(() => {
    return numbers.value.sort((a, b) => b.amount - a.amount);
})


// 计算每个生肖的总金额
const zodiacTotals = computed(() => {
    const totals = {}
    // 初始化所有生肖的总金额为0
    for (const zodiac in zodiacNumberMap) {
        totals[zodiac] = 0
    }
    // 遍历所有数据，累加对应生肖的金额
    // 遍历每个号码，累加到对应生肖
    numbers.value.forEach(item => {
        for (const [zodiac, numbers] of Object.entries(zodiacNumberMap)) {
            if (numbers.includes(item.number)) {
                totals[zodiac] += item.amount;
                break; // 找到对应生肖后跳出循环
            }
        }
    });
    return totals
})

// 按生肖金额排序后的数据，用于展示
const sortedZodiacTotals = computed(() => {
    return Object.entries(zodiacTotals.value)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
})


// 格式化金额显示
const formatAmount = (amount) => {
    return amount.toLocaleString('zh-CN')
}

// 根据金额获取样式类
const getAmountClass = (amount) => {
    if (amount >= 1500) return 'amount-high'
    if (amount >= 1000) return 'amount-medium-high'
    if (amount >= 500) return 'amount-medium'
    return 'amount-default'
}

const getZodiacColor = (zodiac) => {
    const colors = {
        '鼠': '#FFD700', // 金色 - 鼠象征财富
        '牛': '#51d25f', // 深咖啡色 - 牛的稳重厚实
        '虎': '#FF5722', // 橙红色 - 虎的威猛
        '兔': '#E91E63', // 玫粉色 - 兔的可爱
        '龙': '#2196F3', // 亮蓝色 - 龙的尊贵
        '蛇': '#4CAF50', // 翠绿色 - 蛇的神秘
        '马': '#ff370f', // 正红色 - 马的活力奔放
        '羊': '#FFEB3B', // 淡黄色 - 羊的温顺
        '猴': '#00d6e1', // 咖啡色 - 猴的活泼
        '鸡': '#FF9800', // 橙黄色 - 鸡的鲜艳
        '狗': '#fad0a0', // 蓝灰色 - 狗的忠诚可靠
        '猪': '#FF4081'  // 粉红色 - 猪的喜庆
    }
    return colors[zodiac] || '#F5F5F5' // 默认浅灰色
}
</script>

<style scoped>
.zodiac-container {
    padding: 1px;
    max-width: 800px;
    margin: 0 auto;
}

.filter-section {
    margin-bottom: 15px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-select {
    width: 150px;
}

.stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
}

.stat-card {
    background: white;
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-title {
    font-size: 13px;
    color: #666;
    margin-bottom: 6px;
}

.stat-number {
    font-weight: bold;
    font-size: 18px;
}

/* 统计卡片颜色 */
.stat-card.total {
    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
    border-left: 4px solid #0369a1;
}

.stat-card.highest {
    background: linear-gradient(135deg, #fff1f2, #ffe4e6);
    border-left: 4px solid #be123c;
}

.stat-card.count-1500 {
    background: linear-gradient(135deg, #f5f3ff, #ede9fe);
    border-left: 4px solid #6d28d9;
}

.stat-card.count-1000 {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    border-left: 4px solid #047857;
}

.stat-card.count-500 {
    background: linear-gradient(135deg, #fffbeb, #fef3c7);
    border-left: 4px solid #b45309;
}

.stat-card.count-0 {
    background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
    border-left: 4px solid #4b5563;
}

/* 生肖总金额统计 */
.zodiac-totals-section {
    margin: 20px 0;
    padding: 15px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.zodiac-totals-section h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #333;
    text-align: center;
}

.zodiac-totals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
}

.zodiac-total-card {
    border-radius: 8px;
    padding: 12px;
    text-align: center;
    transition: transform 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    color: #333;
}

.zodiac-total-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.zodiac-total-name {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
    color: #1e293b;
}

.zodiac-total-amount {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 3px;
    color: #334155;
}

.zodiac-total-percent {
    font-size: 12px;
    color: #64748b;
}

.zodiac-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
}

.zodiac-card {
    background-color: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s;
}

.zodiac-card:hover {
    transform: translateY(-2px);
}

.zodiac-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid #f0f0f0;
}

.zodiac-number {
    font-weight: bold;
    font-size: 16px;
    color: #333;
}

.zodiac-name {
    font-size: 16px;
    color: #666;
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: bold;
}

.zodiac-content {
    display: flex;
    flex-direction: column;
}

.amount-row {
    display: flex;
    justify-content: center;
}

.value {
    font-weight: 600;
    font-size: 16px;
}

.pao-value {
    color: #ffffff;
    background-color: rgb(9, 199, 9);
    border-radius: 5px;
    padding: 5px;
    font-size: 16px;
    font-weight: 800;
}

/* 金额颜色分类和大小变化 */
.amount-default .value {
    color: #6b7280;
    /* 灰色 */
    font-size: 16px;
}

.amount-medium .value {
    color: #d97706;
    /* 橙色 */
    font-size: 18px;
}

.amount-medium-high .value {
    color: #dc2626;
    /* 红色 */
    font-size: 20px;
}

.amount-high .value {
    color: #7c2d12;
    /* 深红棕色 */
    font-size: 22px;
}

/* 号码类型背景色 */
.zodiac-ping {
    background-color: #ffedd5;
}

.zodiac-te {
    background-color: #fee2e2;
}

@media (max-width: 768px) {
    .zodiac-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 10px;
    }

    .zodiac-card {
        padding: 10px;
    }

    .stats-section {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }

    .zodiac-totals-grid {
        grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    }

    /* 响应式调整字体大小 */
    .amount-default .value {
        font-size: 14px;
    }

    .amount-medium .value {
        font-size: 16px;
    }

    .amount-medium-high .value {
        font-size: 18px;
    }

    .amount-high .value {
        font-size: 20px;
    }
}

@media (max-width: 480px) {
    .zodiac-grid {
        grid-template-columns: repeat(auto-fill, minmax(55px, 1fr));
        gap: 2px;
    }

    .zodiac-number {
        font-size: 13px;
    }

    .zodiac-name {
        font-size: 11px;
    }

    .stats-section {
        grid-template-columns: repeat(2, 1fr);
    }

    .stat-card {
        padding: 10px;
    }

    .stat-title {
        font-size: 12px;
    }

    .stat-number {
        font-size: 16px;
    }

    .zodiac-totals-grid {
        grid-template-columns: repeat(4, 1fr);
    }

    .zodiac-total-card {
        padding: 8px;
    }

    .zodiac-total-name {
        font-size: 13px;
    }

    .zodiac-total-amount {
        font-size: 14px;
    }

    /* 响应式调整字体大小 */
    .amount-default .value {
        font-size: 12px;
    }

    .amount-medium .value {
        font-size: 14px;
    }

    .amount-medium-high .value {
        font-size: 16px;
    }

    .amount-high .value {
        font-size: 18px;
    }

    .filter-section {
        justify-content: flex-start;
    }

    .filter-select {
        width: 120px;
    }
}
</style>