<template>
    <div class="lottery-result" :class="{ 'invalid-state': !mainStore.isValid(index) }">
        <div class="input-section">
            <div class="editable-input-container">
                <input v-model="editableValue" @input="updateInputValue" class="editable-input"
                    placeholder="输入生肖和金额，例如：鼠 牛 虎 各2" />
                <span class="input-hint">格式：号码1 号码2 号码3... 各金额</span>
            </div>
        </div>

        <ResultArea :amount="amount" :selected-numbers="selectedNumbers" :total-amount="totalAmount"></ResultArea>

        <div v-if="hasInvalidNumbers" class="error-message">
            <div class="error-header">
                <span class="error-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                            stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <strong class="error-title">无效号码提示</strong>
            </div>
            <p class="error-description">以下号码不在01-49范围内:</p>
            <div class="invalid-balls-container">
                <span v-for="(num, index) in invalidNumbers" :key="index" class="invalid-ball">
                    {{ num.toString().padStart(2, '0') }}
                </span>
            </div>
            <div class="error-footer">
                <span class="error-tip">请修改为有效号码后继续</span>
            </div>
        </div>
        <ErrorDisplayArea v-if="errorMessage" :message="errorMessage" />
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import ResultArea from '../area/ResultArea.vue';

import ErrorDisplayArea from '../area/ErrorDisplayArea.vue';

const mainStore = useMainStore()
const props = defineProps({
    index: {
        type: Number,
        required: true
    }
});

const editableValue = ref(mainStore.getLineInputValue(props.index) || '');
const errorMessage = ref('')

// 处理输入值
const inputValue = computed(() => {
    errorMessage.value = '';
    const result = mainStore.getLineInputValue(props.index) || '';
    editableValue.value = result
    return result || '';
});

const updateInputValue = () => {
    mainStore.updateBetLine(props.index, editableValue.value);
};

const allNumbers = computed(() => {
    const matches = inputValue.value.split(/共|合计|共计/)[0].match(/\d+/g);
    return matches ? matches.map(num => parseInt(num, 10)) : [];
});

const selectedNumbers = computed(() => {
    const inputValueTmp = inputValue.value.split(/共|合计|共计/)[0];
    if (!inputValueTmp.match(/\d+/g)) {
        if (inputValue.value != '') {
            errorMessage.value = '无数据，请清空输入';
        }
        mainStore.setSelectNumbers(props.index, []);
        return []
    }
    if (inputValueTmp.match(/\d+/g).length == 1) {
        errorMessage.value = '无效，有效数据只有一个';
        mainStore.setSelectNumbers(props.index, []);
        return []
    }
    if (amount.value == 0) {
        errorMessage.value = '无效金额为0';
        mainStore.setSelectNumbers(props.index, []);
        return []
    }
    const result = inputValueTmp.split(/个|各|包|个包|各包|各数|个数|个号|个码|各码/)[0];
    const matches = result.match(/\d+/g)?.map(num => {
        const parsedNum = parseInt(num, 10);
        return parsedNum < 10 ? `0${parsedNum}` : `${parsedNum}`;
    }) || [];
    mainStore.setSelectNumbers(props.index, matches);
    return matches
});

const amount = computed(() => {
    const inputValueTmp = inputValue.value.split(/共|合计|共计/)[0];
    if (!inputValueTmp) {
        mainStore.setAmount(props.index, 0);
        return 0;
    }
    const result = inputValueTmp.split(/个|各|包|每/);
    if (result.length === 2) {
        const numbers = result[1].match(/\d+/g);
        if (!numbers || numbers.length === 0 || numbers.length > 1) {
            mainStore.setAmount(props.index, 0);
            return 0;
        }
        mainStore.setAmount(props.index, parseInt(numbers[0], 10));
        return parseInt(numbers[0], 10);
    }
    mainStore.setAmount(props.index, 0);
    return 0;
});

const totalAmount = computed(() => {
    return selectedNumbers.value.length * amount.value;
});

const invalidNumbers = computed(() => {
    return allNumbers.value
        .slice(0, -1)
        .filter(num => num < 1 || num > 49)
        .map(num => num.toString());
});

const hasInvalidNumbers = computed(() => invalidNumbers.value.length > 0);

const isValid = computed(() => {
    if (inputValue.value === '' && amount.value == 0 && selectedNumbers.value.length == 0) {
        return true
    } else if (inputValue.value !== '' && amount.value != 0 && selectedNumbers.value.length != 0) {
        return true
    } else {
        return false
    }
});

watch(() => [isValid.value], (newVal) => {
    if (newVal[0]) {
        mainStore.setBetLineValid(props.index);
        mainStore.setType(props.index, '直选');
    } else {
        mainStore.setBetLineInvalid(props.index);
    }
}, { immediate: true });
</script>

<style scoped>
.keyword-highlight {
    background-color: #FFD700;
    padding: 0 2px;
    border-radius: 3px;
    font-weight: bold;
    color: #000;
}

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

.input-highlight {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    padding: 4px 8px;
    background-color: #f8f8f8;
    border-radius: 4px;
    display: inline-block;
    margin-top: 6px;
}

.error-message {
    padding: 16px;
    margin-top: 20px;
    border-radius: 12px;
    background-color: #FFF5F5;
    border: 1px solid #FEE2E2;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    animation: fadeIn 0.3s ease-out;
}

.error-header {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    gap: 8px;
}

.error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
}

.error-title {
    color: #DC2626;
    font-size: 1rem;
    font-weight: 600;
}

.error-description {
    margin: 0 0 12px 0;
    color: #57534E;
    font-size: 0.875rem;
    line-height: 1.5;
}

.invalid-balls-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
}

.invalid-ball {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 0 8px;
    background: linear-gradient(135deg, #FEE2E2, #FECACA);
    color: #B91C1C;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    border: 1px solid #FCA5A5;
}

.error-footer {
    display: flex;
    align-items: center;
    gap: 6px;
}

.error-tip {
    color: #78716C;
    font-size: 0.75rem;
    line-height: 1.5;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    .lottery-result {
        padding: 15px;
    }

    .editable-input {
        padding: 10px 12px;
        font-size: 15px;
    }

    .error-message {
        padding: 12px;
    }

    .invalid-ball {
        min-width: 28px;
        height: 28px;
        font-size: 0.8125rem;
    }
}
</style>