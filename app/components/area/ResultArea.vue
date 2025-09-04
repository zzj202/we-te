<template>
    <div class="result-section">
        <div class="numbers-display">
            <div class="section-title">
                <span class="title-icon">🎯</span>
                <strong>选号号码</strong>
            </div>
            <div class="balls-container">
                <template v-if="selectedNumbers.length > 0">
                    <span v-for="(num, index) in selectedNumbers" :key="index" class="lottery-ball">
                        {{ num }}
                    </span>
                </template>
                <span v-else class="empty-message">暂无选号</span>
            </div>
        </div>
        <div class="divider-vertical"></div>
        <div class="amount-section">
            <div class="section-title">
                <span class="title-icon">💰</span>
                <strong>金额信息</strong>
            </div>
            <div class="amount-info">
                <div class="amount-row">
                    <span class="label">投注金额:</span>
                    <span class="amount">{{ amount }} 元</span>
                </div>
                <div class="amount-row">
                    <span class="label">号码数量:</span>
                    <span class="number-count">{{ selectedNumbers.length }} 个</span>
                </div>
                <div class="amount-row total">
                    <span class="label">总金额:</span>
                    <span class="total-amount">{{ totalAmount }} 元</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    selectedNumbers: {
        type: Array,
        default: []
    },
    amount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    }
})
</script>

<style scoped>
.result-section {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
}

.numbers-display {
    flex: 2;
    padding: 12px;
    background-color: #f8fafc;
    border-radius: 8px;
}

.amount-section {
    flex: 1;
    padding: 5px;
    background-color: #f8fafc;
    border-radius: 8px;
}

.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.title-icon {
    font-size: 1rem;
    margin-right: 6px;
}

.section-title strong {
    color: #2c3e50;
    font-size: 0.95rem;
}

.balls-container {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 32px;
}

.lottery-ball {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #3498db, #2ecc71);
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 0.85rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
}

.lottery-ball:hover {
    transform: scale(1.05);
}

.divider-vertical {
    width: 1px;
    background-color: #e0e0e0;
}

.amount-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.amount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.amount-row.total {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px dashed #ddd;
}

.label {
    color: #7f8c8d;
    font-size: 0.85rem;
}

.amount {
    font-size: 0.95rem;
    color: #27ae60;
    font-weight: bold;
}

.number-count {
    font-weight: bold;
    color: #3498db;
    font-size: 0.95rem;
}

.total-amount {
    font-size: 1.1rem;
    color: #e67e22;
    font-weight: bold;
}

@media (max-width: 600px) {
    .result-section {
        flex-direction: column;
        gap: 8px;
    }

    .divider-vertical {
        display: none;
    }

    .amount-section {
        margin-top: 8px;
    }
}
</style>