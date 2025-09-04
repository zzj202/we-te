<template>
    <div class="card" :class="getCardClass(amount)">
        <div class="card-header">
            <span class="card-number">{{ number.toString().padStart(2, '0') }}</span>
            <span class="card-zodiac">{{ zodiac }}</span>
        </div>
        <div class="card-body">
            <div class="card-amount">{{ amount.toLocaleString() }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    number: {
        type: String,
        required: true,
    },
    zodiac: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    }
});

const getCardClass = (amount) => {
    if (amount === 0) return 'zero';
    if (amount < 400) return 'low';
    if (amount < 500) return 'medium';
    if (amount < 800) return 'high';
    if (amount < 1000) return 'very-high';
    if (amount < 1500) return 'super-high';
    return 'ultra-high';
};
</script>

<style scoped>
.card {
    border-radius: 8px;
    padding: 2px;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1px;
    font-size: 13px;
    font-weight: 1000;
    color: #6c757d;
    padding: 3px;

}

.card-number {
    padding: 2px 6px;
}

.card-zodiac {
    font-weight: 600;
    font-size: 13px;
    color: #666;
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
}

.card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
}

.card-amount {
    font-weight: 600;
    text-align: center;
}

/* 金额颜色样式 */
/* 金额颜色样式 - 明显渐变色方案 */
.zero .card-amount {
    color: #acacac;
    /* 亮绿色（低金额） */
    font-size: 12px;
}

.low .card-amount {
    color: #8f8888;
    /* 亮绿色（低金额） */
    font-size: 14px;
}


.medium .card-amount {
    color: #f1c40f;
    /* 亮黄色（中间值） */
    font-size: 14px;
}

.high .card-amount {
    color: #d35400;
    /* 深橙色 */
    font-size: 16px;
}

.very-high .card-amount {
    color: #e74c3c;
    /* 亮红色 */
    font-size: 16px;
}

.super-high .card-amount {
    color: #c0392b;
    /* 深红色 */
    font-size: 18px;
}

.ultra-high .card-amount {
    color: #8b0000;
    /* 暗红色（最高级别） */
    font-size: 18px;
    font-weight: bold;
    /* 添加粗体强调 */
}
</style>