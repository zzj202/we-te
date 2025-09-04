<template>
    <div class="lottery-result" :class="{ 'invalid-state': !mainStore.isValid(index) }">
        <div class="input-section">
            <div class="editable-input-container">
                <input v-model="editableValue" @input="updateInputValue" class="editable-input"
                    placeholder="输入生肖和金额，例如：鼠 牛 虎 各2" />
                <span class="input-hint">格式：生肖1 生肖2 生肖3...金额</span>
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

// 生肖与号码的映射
const ZODIAC_MAP = {
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
};


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

// 更新存储中的值
const updateInputValue = () => {
    mainStore.updateBetLine(props.index, editableValue.value);
};

// 获取选中的号码
const selectedNumbers = computed(() => {
    return Object.keys(ZODIAC_MAP)
        .filter(keyword => inputValue.value.includes(keyword))
        .flatMap(keyword => ZODIAC_MAP[keyword]);
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
    input = input?.split(/共|合计/)[0]
    if (!input) return;

    if (input.includes('平')) {
        errorMessage.value = '暂不支持平投注';
        return;
    }

    const amountMatch = input.match(/\d+/g);
    if (!amountMatch || amountMatch.length !== 1) {
        errorMessage.value = '金额格式错误';
        return;
    }

    const tmpAmount = Number(amountMatch[0]);
    const numbers = Object.keys(ZODIAC_MAP)
        .filter(keyword => input.includes(keyword))
        .flatMap(keyword => ZODIAC_MAP[keyword]);

    if (numbers.length === 0) {
        errorMessage.value = '未识别有效生肖';
        return;
    }


    //无蛇的情况
    if (numbers.length % 4 == 0) {
        //鸡   鸡狗  多肖同包
        if (input.includes('个肖') || input.includes('个包') || input.includes('各包') || input.includes('各肖')) {
            // 你的代码
            amount.value = tmpAmount / 4
        } else {
            //鸡    单肖各数
            if (numbers.length == 4) {
                if (input.includes('个') || input.includes('各')) {
                    amount.value = tmpAmount
                } else {
                    amount.value = tmpAmount / 4
                }
            } else {
                //鸡狗 多肖个数
                if (input.includes('个数') || input.includes('各数') || input.includes('各号') || input.includes('个号') || input.includes('各码') || input.includes('各马') || input.includes('个码') || input.includes('个马')) {
                    amount.value = tmpAmount
                } else {
                    errorMessage.value = '输入不明确，请确认是否有 各'
                }

            }

        }
    } else {
        //有蛇 
        //单独蛇
        if (numbers.length === 5) {
            if (input.includes('个码') || input.includes('个码') || input.includes('个号') || input.includes('各号') || input.includes('个') || input.includes('各') || input.includes('个数') || input.includes('各数')) {
                amount.value = tmpAmount
            } else {
                amount.value = tmpAmount / 5
            }
        } else {
            //混蛇
            if (input.includes('个数') || input.includes('各数') || input.includes('各号') || input.includes('个号') || input.includes('各码') || input.includes('个码')) {
                amount.value = tmpAmount
            } else {
                errorMessage.value = '蛇的号码数量不一样，请单独包肖'
            }

        }
    }
};

// 监听有效性变化
watchEffect(() => {
    if (isValid.value) {
        mainStore.setBetLineValid(props.index);
        mainStore.setSelectNumbers(props.index, selectedNumbers.value);
        mainStore.setAmount(props.index, amount.value);
        mainStore.setType(props.index, '包肖');
        mainStore.setInputValue(props.index, inputValue.value);
        mainStore.setDescription(props.index, Object.keys(ZODIAC_MAP)
            .filter(keyword => inputValue.value.includes(keyword)).join(','))
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