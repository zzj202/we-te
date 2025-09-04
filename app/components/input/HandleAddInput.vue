<template>
    <div class="betting-parser-container">
        <div class="input-section">
            <div class="input-header">
                <label for="betting-input" class="input-label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="input-icon">
                        <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    输入投注内容
                </label>
                <div style="display: flex; gap: 5px;justify-content: center;align-items: center;">
                    <button class="clear-button" @click="organizeInpt">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="16 3 21 3 21 8"></polyline>
                            <line x1="4" y1="14" x2="9" y2="14"></line>
                            <line x1="4" y1="10" x2="13" y2="10"></line>
                            <line x1="4" y1="6" x2="17" y2="6"></line>
                            <polyline points="21 16 16 16 16 21"></polyline>
                        </svg>
                        整理
                    </button>
                    <button class="clear-button" @click="clearInput">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                            </path>
                        </svg>
                        清空
                    </button>
                    <button class="action-button confirm-button" @click="confirm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="feather feather-check-circle">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        提交投注
                    </button>
                </div>
            </div>

            <textarea id="betting-input" v-model="inputText" @input="parseText"
                placeholder="请输入投注内容，例如：(13.43.30.31.40.25.16.各五)" class="betting-input" rows="5"></textarea>
        </div>



        <div class="results-section" v-if="lines.length > 0">
            <div class="section-header">
                <h3>解析结果</h3>
                <span class="result-count">{{ lines.length }} 条记录</span>
            </div>
            <div v-if="refresh" class="line-numbers">
                <div v-for="(value, index) in lines" :key="index" class="line-number-item">
                    <span class="number-badge">{{ index + 1 }}</span>
                    <CheckBetArea :index="index + 1"></CheckBetArea>
                </div>
            </div>
            <button class="action-button confirm-button bottom-confirm-button" @click="confirm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="feather feather-check-circle">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                提交投注
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import CheckBetArea from '../area/CheckBetArea.vue'
import { createDiscreteApi } from 'naive-ui'

const { dialog, message } = createDiscreteApi(['dialog', 'message'])
const mainStore = useMainStore()
const gameStore = useGameStore()
const inputText = ref('')
const lines = ref([])
const refresh = ref(true)

watch(() => mainStore.addBetString, (newValue) => {
    inputText.value = newValue
    // lines.value = newValue.split('\n').filter(line => line.trim())
}, { immediate: true })

const parseText = debounce(() => {
    refresh.value = false
    lines.value = inputText.value.split('\n').filter(line => line.trim())
    mainStore.addBetString = inputText.value
    mainStore.handleAddBetString()
    setTimeout(() => {
        refresh.value = true
    }, 50)
}, 500)
const organizeInpt = () => {
    const lines = inputText.value.split('\n').filter(line => line.trim())
    inputText.value = lines.join('\n')
    parseText()
    // mainStore.handleAddBetString()
}
const clearInput = () => {
    inputText.value = ''
    lines.value = []
    mainStore.addBetString = ''
    mainStore.handleAddBetString()
}

const confirm = () => {
    if (mainStore.addBetLines.length == 0) {
        message.warning(`请输入数据`)
        return
    }
    if (gameStore.currentSession.name === '') {
        message.warning(`当前场次不存在，请先创建场次`);
        return
    }
    const { canConfirm, invalidIndexes } = mainStore.isCanConfirm()
    if (canConfirm) {
        dialog.success({
            title: '投注',
            content: `批量投注${mainStore.addBetLines.filter(line => line.amount > 0).length}条，总金额为${mainStore.addBetLines.reduce((total, item) => total + item.totalAmount, 0)}元`,
            positiveText: '确定',
            negativeText: '取消',
            maskClosable: false,
            onPositiveClick: () => {
                gameStore.place(mainStore.addBetLines)
                console.log(mainStore.addBetLines)
                message.success('已提交')
            },
            onNegativeClick: () => {
                message.warning('取消')
            }
        })
    } else {
        console.log(invalidIndexes.map(i => mainStore.addBetLines[i - 1]));
        message.error(`以下行输入有误：${invalidIndexes.join(', ')}`)
    }
}
</script>

<style scoped>
.betting-parser-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: #1a1a1a;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.input-section {
    margin-bottom: 12px;
}

.input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.input-label {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: #2d3748;
    font-size: 14px;
}

.clear-button {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 12px;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s ease;
}

.clear-button:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e0;
}

.input-icon {
    width: 16px;
    height: 16px;
    fill: #4a5568;
    margin-right: 6px;
}

.betting-input {
    width: 100%;
    padding: 12px;
    font-size: 13px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    resize: vertical;
    min-height: 100px;
    transition: all 0.3s ease;
    line-height: 1.5;
    background-color: #f8fafc;
}

.betting-input:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
    background-color: #fff;
}

.betting-input::placeholder {
    color: #a0aec0;
    font-size: 13px;
}

.results-section {
    margin-top: 16px;
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.section-header h3 {
    font-size: 15px;
    font-weight: 600;
    color: #2d3748;
    margin: 0;
}

.result-count {
    font-size: 12px;
    color: #718096;
    background-color: #edf2f7;
    padding: 2px 6px;
    border-radius: 10px;
}

.line-numbers {
    margin-bottom: 8px;
    background-color: #ffffff;
    border-radius: 6px;
    overflow-y: scroll;
    height: 50vh;
}

.line-number-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    padding: 6px;
    background-color: #f8fafc;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.line-number-item:hover {
    background-color: #f1f5f9;
}

.number-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: #4299e1;
    color: white;
    border-radius: 50%;
    font-size: 11px;
    font-weight: 500;
    margin-right: 8px;
    flex-shrink: 0;
}

.action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    gap: 4px;
}

.action-button svg {
    width: 14px;
    height: 14px;
}

.confirm-button {
    background-color: #48bb78;
    color: white;
}

.confirm-button:hover {
    background-color: #38a169;
}

.bottom-confirm-button {
    margin-top: 2px;
    width: 100%;
    padding: 5px;
    font-size: 14px;
}

@media (max-width: 480px) {
    .betting-parser-container {
        padding: 8px;
    }

    .betting-input {
        padding: 10px;
        font-size: 12px;
    }

    .action-button {
        padding: 8px;
        font-size: 12px;
    }
}
</style>