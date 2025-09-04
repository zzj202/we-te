<template>
    <div class="input-container">
        <div class="input-wrapper">
            <input type="text" v-model.trim="inputText" @input="processInput" placeholder="输入号码，如：06.18.30.16.28.40.03"
                class="input-field" />
            <span class="input-hint">输入1-7个01-49的数字，用空格/逗号/句号分隔（前六个平码，后一个特码）</span>
        </div>

        <div class="result-container" v-if="hasResult">
            <div class="result-section">
                <span class="result-label">平码:</span>
                <div class="number-bubbles">
                    <span v-for="(num, index) in flatCodes" :key="'ping-' + index" class="number-bubble">
                        {{ num }}
                    </span>
                </div>
            </div>

            <div class="result-section" v-if="specialCode">
                <span class="result-label">特码:</span>
                <span class="number-bubble special">{{ specialCode }}</span>
            </div>
        </div>

        <transition name="fade">
            <div v-if="errorMessage" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="error-icon">
                    <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {{ errorMessage }}
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
    flatCodes: {
        type: Array as () => string[],
        default: () => []
    },
    specialCode: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:flatCodes', 'update:specialCode'])
const inputText = ref(props.flatCodes.length ? props.flatCodes.join(' ') + ' ' + props.specialCode : '')
const errorMessage = ref('')

const hasResult = computed(() => (props.flatCodes, props.flatCodes.length > 0) || props.specialCode !== '')

const processInput = () => {
    // 清除所有分隔符，只保留数字
    const numbers = inputText.value.split(/[\s,.，、]+/).filter(n => n.trim() !== '')

    // 重置状态
    errorMessage.value = ''
    emit('update:flatCodes', [])
    emit('update:specialCode', '')

    if (numbers.length === 0) return

    // 验证数字
    for (const num of numbers) {
        const numInt = parseInt(num, 10)

        if (isNaN(numInt)) {
            errorMessage.value = `错误："${num}" 不是有效数字`
            return
        }

        if (numInt < 1 || numInt > 49) {
            errorMessage.value = `错误：数字 "${num}" 超出范围 (01-49)`
            return
        }
    }
    if (numbers.length > 7) {
        errorMessage.value = `平码和数量错误，共有${numbers.length-1}个`
    }

    // 格式化为两位数
    const formattedNumbers = numbers.map(num => {
        const numInt = parseInt(num, 10)
        return numInt < 10 ? `0${numInt}` : `${numInt}`
    })

    if (formattedNumbers.length <= 6) {
        emit('update:flatCodes', formattedNumbers)
    } else {
        emit('update:specialCode', formattedNumbers[formattedNumbers.length - 1])
        emit('update:flatCodes', formattedNumbers.slice(0, -1))
    }
}
</script>

<style scoped>
.input-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 12px;
    font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.input-wrapper {
    margin-bottom: 16px;
}

.input-field {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: border-color 0.3s ease;
    background-color: #f9f9f9;
}

.input-field:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.input-hint {
    display: block;
    margin-top: 8px;
    font-size: 12px;
    color: #757575;
}

.result-container {
    margin-top: 20px;
    padding: 16px;
    background-color: #f5f7fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.result-section {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.result-section:last-child {
    margin-bottom: 0;
}

.result-label {
    font-weight: 600;
    color: #333;
    margin-right: 12px;
    min-width: 40px;
}

.number-bubbles {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.number-bubble {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: #4a90e2;
    color: white;
    border-radius: 50%;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.number-bubble.special {
    background-color: #ff6b6b;
    width: 42px;
    height: 42px;
    font-size: 18px;
}

.error-message {
    display: flex;
    align-items: center;
    margin-top: 16px;
    padding: 12px 16px;
    background-color: #ffebee;
    color: #d32f2f;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
}

.error-icon {
    width: 18px;
    height: 18px;
    fill: currentColor;
    margin-right: 8px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (max-width: 480px) {
    .input-container {
        padding: 16px;
    }

    .input-field {
        padding: 10px 14px;
    }

    .number-bubble {
        width: 32px;
        height: 32px;
        font-size: 14px;
    }

    .number-bubble.special {
        width: 36px;
        height: 36px;
    }
}
</style>