<template>
    <div class="lottery-result" :class="{ 'invalid-state': !mainStore.isValid(index) }">
        <div class="input-section">
            <div class="editable-input-container">
                <input v-model="editableValue" @input="updateInputValue" class="editable-input"
                    placeholder="输入生肖和金额，例如：鼠 牛 虎 各2" />
                <span class="input-hint">格式：x头 或x尾 各30</span>
            </div>
        </div>

        <ResultArea :amount="amount" :selected-numbers="selectedNumbers" :total-amount="totalAmount" />

        <ErrorDisplay v-if="errorMessage" :message="errorMessage" />
    </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import ResultArea from '@/components/area/ResultArea.vue';
import ErrorDisplay from '@/components/area/ErrorDisplayArea.vue'


const mainStore = useMainStore();
const props = defineProps({
    index: {
        type: Number,
        required: true
    }
});


// 处理输入值
const inputValue = computed(() => {
    resetValidation();
    const result = mainStore.getLineInputValue(props.index) || '';
    editableValue.value = result;
    validateInput(result);
    return result || '';
});

const editableValue = ref(mainStore.getLineInputValue(props.index) || '');
const amount = ref(0);
const errorMessage = ref('');
const a = ref('')
const b = ref('')
const chineseToNumber = {
    "零": 0, "一": 1, "二": 2, "三": 3, "四": 4,
    "五": 5, "六": 6, "七": 7, "八": 8, "九": 9,
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4,
    "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
};

// 更新存储中的值
const updateInputValue = () => {
    mainStore.updateBetLine(props.index, editableValue.value);
};

// 获取选中的号码
const selectedNumbers = computed(() => {
    const match = inputValue.value.match(/^([0-9零一二三四五六七八九])(尾|头)/);
    a.value = match ? match[1] : null; // 提取数字部分
    b.value = match ? match[2] : null //提取 单位 头尾
    const number = a.value ? chineseToNumber[a.value] : null
    const result = []
    if (number !== null && b.value !== null) {
        if (b.value === "头") {
            // "头" → 十位数是 number 的所有两位数（如 "3头" → [31, 32, 33, ..., 39]）
            for (let i = 0; i <= 9; i++) {
                const num = number * 10 + i;
                if (num >= 1 && num <= 49) {
                    result.push(num.toString().padStart(2, '0')); // 补零
                }
            }
            if (a.value > 4) {
                errorMessage.value = `号码错误不存在 ${a.value + b.value}，头只有 0-4`
            }
        } else if (b.value === "尾") {
            // "尾" → 生成个位数匹配的号码，如 "3尾" → [03, 13, 23, 33, 43]
            for (let i = 1; i <= 49; i++) {
                if (i % 10 === number) {
                    result.push(i.toString().padStart(2, '0')); // 补零
                }
            }
        }
    }
    return result
});

// 计算总金额
const totalAmount = computed(() => selectedNumbers.value.length * amount.value);

// 验证输入有效性
const isValid = computed(() => amount.value > 0 && selectedNumbers.value.length > 0);

// 重置验证状态
const resetValidation = () => {
    errorMessage.value = '';
    amount.value = 0;
};

// 验证输入
const validateInput = (input) => {
    input = input.split(/共|合计/)[0]
    if (!input) return;
    const amountMatch = input.replace(/\d+[头尾]|[零一二三四五六七八九]+[头尾]/g, "").match(/\d+/g)
    if (!amountMatch || amountMatch.length !== 1) {
        errorMessage.value = '金额格式错误';
        return;
    }
    if (input.includes('个') || input.includes('个数') || input.includes('各') || input.includes('各数')) {

        amount.value = Number(amountMatch[0]);
    } else {
        errorMessage.value = '金额不准确，请明确是否为 各数。 请在金额前添加各';
    }
};

// 监听有效性变化
watchEffect(() => {
    if (isValid.value) {
        mainStore.setBetLineValid(props.index);
        mainStore.setSelectNumbers(props.index, selectedNumbers.value);
        mainStore.setAmount(props.index, amount.value);
        mainStore.setType(props.index, '包头尾');
        mainStore.setDescription(props.index, a.value + b.value);
        mainStore.setInputValue(props.index, inputValue.value);
    } else {
        mainStore.setBetLineInvalid(props.index);
    }
});
</script>

<style scoped>
/* 样式保持不变 */
.lottery-result {
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    max-width: 680px;
    margin: 0 auto;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.lottery-result.invalid-state {
    background-color: #fff0f0;
    border: 1px solid #ffcccc;
    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.1);
}

.input-section {
    margin-bottom: 12px;
}


.editable-input-container {
    position: relative;
    margin-bottom: 15px;
}

.editable-input {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: all 0.3s;
    box-sizing: border-box;
    background-color: #f9f9f9;
}

.editable-input:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    background-color: #fff;
}

.input-hint {
    display: block;
    font-size: 0.8rem;
    color: #888;
    margin-top: 5px;
    padding-left: 5px;
}

@media (max-width: 600px) {
    .lottery-result {
        padding: 15px;
    }

    .editable-input {
        padding: 10px 12px;
        font-size: 15px;
    }
}
</style>