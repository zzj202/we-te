<template>
    <div class="bet-app">
        <div class="bet-layout">
            <!-- 左侧：投注操作区域 -->
            <div class="bet-control-panel">
                <div class="panel-header">
                    <h2 class="panel-title">号码加注</h2>
                    <div class="panel-subtitle">选择号码并设置加注金额</div>
                </div>


                <!-- 十二生肖按钮组 -->
                <div class="quick-selector zodiac-selector">
                    <div class="selector-header">
                        <span class="selector-title">生肖选择</span>
                        <span class="selector-count" v-if="selectedZodiacs.length > 0">
                            已选 {{ selectedZodiacs.length }} 个生肖
                        </span>
                    </div>
                    <!-- 新增的智能识别输入框 -->
                    <div class="input-group zodiac-input-group">
                        <input type="text" v-model="zodiacInput" @input="parseZodiacInput"
                            placeholder="输入生肖名称，如：马包米 或 龙,猴,兔 或 鸡100狗3羊各数" class="zodiac-input">
                    </div>
                    <div class="quick-btn-group">
                        <button v-for="zodiac in zodiacList" :key="zodiac.name"
                            @click="toggleZodiacSelection(zodiac.name)" :class="{
                                'active': selectedZodiacs.includes(zodiac.name),
                                'disabled': (selectedNumbers.length > 0 || selectedTails.length > 0 || selectedSpecials.length > 0 || selectedHeads.length > 0)
                            }" class="quick-btn zodiac-btn">
                            <span class="zodiac-icon">{{ zodiac.emoji }}</span>
                            {{ zodiac.name }}
                        </button>
                    </div>

                </div>
                <!-- 提交按钮  -->
                <div class="button-group">
                    <button class="submit-btn" @click="handleSubmit" :disabled="!isFormValid">
                        <span class="btn-text">确认加注</span>
                        <span class="btn-amount" v-if="isFormValid">
                            ¥{{ numberArray.length * betCount }}
                        </span>
                    </button>
                    <button class="reset-btn" @click="resetForm" :disabled="!hasSelection">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path
                                d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>重置</span>
                    </button>
                </div>
                <!-- 数字输入区域 -->
                <div class="input-group">
                    <label for="number-input" class="input-label">
                        <svg class="input-icon" viewBox="0 0 24 24">
                            <path d="M4 7V4H20V7M5 9H19V20H5V9M12 11V16" stroke="#64748B" stroke-width="2"
                                stroke-linecap="round" />
                        </svg>
                        输入号码（支持多种分隔符）
                    </label>
                    <input id="number-input" type="text" v-model="inputValue"
                        placeholder="例如：43.12.48.46.13.37.6.25.33.7.46.47 或 08/10/18/48" @input="processNumbers"
                        class="bet-input">
                </div>
                <!-- 错误提示 -->
                <div class="error-card" v-if="errorMessage">
                    <svg class="error-icon" viewBox="0 0 24 24">
                        <path
                            d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="#EF4444" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <div class="error-content">
                        <h3 class="error-title">输入错误</h3>
                        <p class="error-message">{{ errorMessage }}</p>
                    </div>
                </div>
                <!-- 注数输入区域 -->
                <div class="input-group bet-amount-group">
                    <label for="bet-count" class="input-label">
                        <svg class="input-icon" viewBox="0 0 24 24">
                            <path
                                d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                                stroke="#64748B" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        加注金额
                    </label>
                    <div class="bet-input-wrapper">
                        <input id="bet-count" type="number" v-model.number="betCount" min="1" placeholder="输入金额"
                            @input="processBetCount" class="bet-input">
                        <div class="quick-bet-buttons">
                            <button v-for="count in quickBetCounts" :key="count" @click="setBetCount(count)"
                                class="quick-bet-btn" :class="{ 'active': betCount === count }">
                                ¥{{ count }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 结果展示 -->
                <div class="result-card" v-if="numberArray.length > 0 && !errorMessage">
                    <div class="result-header">
                        <svg class="result-icon" viewBox="0 0 24 24">
                            <path
                                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="#3B82F6" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        <span>已选号码</span>
                    </div>
                    <div class="number-badge-container">
                        <span v-for="(number, index) in numberArray" :key="index" class="number-badge">
                            {{ number }}
                        </span>
                    </div>
                    <div class="bet-summary" v-if="betCount > 0">
                        <div class="summary-item">
                            <span class="summary-label">每个号码加注：</span>
                            <span class="summary-value">¥{{ betCount }}</span>
                        </div>
                        <div class="summary-item total">
                            <span class="summary-label">总金额：</span>
                            <span class="summary-value">¥{{ numberArray.length * betCount }}</span>
                        </div>
                    </div>
                </div>
                <!-- 特殊选择 -->
                <div class="quick-selector special-selector">
                    <div class="selector-header">
                        <span class="selector-title">特殊选择</span>
                        <span class="selector-count" v-if="selectedSpecials.length > 0">
                            已选 {{ selectedSpecials.length }} 个
                        </span>
                    </div>
                    <div class="quick-btn-group">
                        <button v-for="special in specialList" :key="special.name"
                            @click="toggleSpecialSelection(special.name)" :class="{
                                'active': selectedSpecials.includes(special.name),
                                'disabled': (selectedNumbers.length > 0 || selectedTails.length > 0 || selectedZodiacs.length > 0 || selectedHeads.length > 0)
                            }" class="quick-btn">
                            {{ special.name }}
                        </button>
                    </div>
                </div>
                <!-- 尾数快捷按钮 -->
                <div class="quick-selector tail-selector">
                    <div class="selector-header">
                        <span class="selector-title">尾数选择</span>
                        <span class="selector-count" v-if="selectedTails.length > 0">
                            已选 {{ selectedTails.length }} 个尾数
                        </span>
                    </div>
                    <div class="quick-btn-group">
                        <button v-for="tail in 10" :key="tail" @click="toggleTailSelection(tail === 10 ? 0 : tail)"
                            :class="{
                                'active': selectedTails.includes(tail === 10 ? 0 : tail),
                                'disabled': (selectedNumbers.length > 0 || selectedZodiacs.length > 0 || selectedSpecials.length > 0 || selectedHeads.length > 0)
                            }" class="quick-btn">
                            {{ tail === 10 ? '0' : tail }}尾
                        </button>
                    </div>
                </div>
                <!-- 头部选择器 -->
                <div class="quick-selector head-selector">
                    <div class="selector-header">
                        <span class="selector-title">头部选择</span>
                        <span class="selector-count" v-if="selectedHeads.length > 0">
                            已选 {{ selectedHeads.length }} 个头数
                        </span>
                    </div>
                    <div class="quick-btn-group">
                        <button v-for="head in 5" :key="head" @click="toggleHeadSelection(head - 1)" :class="{
                            'active': selectedHeads.includes(head - 1),
                            'disabled': (selectedNumbers.length > 0 || selectedTails.length > 0 || selectedZodiacs.length > 0 || selectedSpecials.length > 0)
                        }" class="quick-btn">
                            {{ head - 1 }}头
                        </button>
                    </div>
                </div>
                <!-- 01-49数字按钮 -->
                <div class="number-selector">
                    <div class="selector-header">
                        <span class="selector-title">号码选择</span>
                        <span class="selector-count" v-if="selectedNumbers.length > 0">
                            已选 {{ selectedNumbers.length }} 个
                        </span>
                    </div>
                    <div class="number-grid">
                        <button v-for="num in 49" :key="num" @click="toggleNumberSelection(num)" :class="{
                            'active': selectedNumbers.includes(num),
                            'disabled': (selectedTails.length > 0 || selectedZodiacs.length > 0 || selectedSpecials.length > 0 || selectedHeads.length > 0)
                        }" class="number-btn">
                            <span class="number-text">{{ num < 10 ? '0' + num : num }}</span>
                                    <span class="number-check">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2"
                                                stroke-linecap="round" />
                                        </svg>
                                    </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createDiscreteApi } from 'naive-ui'

const { dialog, message, loadingBar } = createDiscreteApi(
    ['dialog', 'message', 'loadingBar']
)
const gameStore = useGameStore()
const inputValue = ref('')
const numberArray = ref([])
const errorMessage = ref('')
const betCount = ref(0)
const selectedTails = ref([])
const selectedZodiacs = ref([])
const selectedNumbers = ref([])
const selectedSpecials = ref([])
const selectedHeads = ref([])
const zodiacInput = ref('')

// 固定的快速注数按钮
const fixedQuickBetCounts = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 75, 80, 100, 120, 125, 150, 200, 250, 300, 400, 500]
const quickBetCounts = ref([...fixedQuickBetCounts])
const customBetCount = ref(null)

// 尾数对应的数字
const tailNumbers = {
    0: ['10', '20', '30', '40'],
    1: ['01', '11', '21', '31', '41'],
    2: ['02', '12', '22', '32', '42'],
    3: ['03', '13', '23', '33', '43'],
    4: ['04', '14', '24', '34', '44'],
    5: ['05', '15', '25', '35', '45'],
    6: ['06', '16', '26', '36', '46'],
    7: ['07', '17', '27', '37', '47'],
    8: ['08', '18', '28', '38', '48'],
    9: ['09', '19', '29', '39', '49']
}

// 头部数字映射
const headNumbers = {
    0: ['01', '02', '03', '04', '05', '06', '07', '08', '09'],
    1: ['11', '12', '13', '14', '15', '16', '17', '18', '19'],
    2: ['21', '22', '23', '24', '25', '26', '27', '28', '29'],
    3: ['31', '32', '33', '34', '35', '36', '37', '38', '39'],
    4: ['41', '42', '43', '44', '45', '46', '47', '48', '49'],
}

// 特殊选项数据
const specialList = ref([
    { name: '单', numbers: ['01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23', '25', '27', '29', '31', '33', '35', '37', '39', '41', '43', '45', '47', '49'] },
    { name: '双', numbers: ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48'] },
    { name: '大', numbers: ['25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49'] },
    { name: '小', numbers: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'] },
    { name: '大双', numbers: ['26', '28', '30', '32', '34', '36', '38', '40', '42', '44', '46', '48'] },
    { name: '小双', numbers: ['02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24'] },
    { name: '大单', numbers: ['25','27', '29', '31', '33', '35', '37', '39', '41', '43', '45', '47', '49'] },
    { name: '小单', numbers: ['01', '03', '05', '07', '09', '11', '13', '15', '17', '19', '21', '23'] },
    { name: '红波', numbers: ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46'] },
    { name: '蓝波', numbers: ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48'] },
    { name: '绿波', numbers: ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49'] },
    { name: '绿单', numbers: ['05', '11', '17', '21', '27', '33', '39', '43', '49'] },
    { name: '绿双', numbers: ['06', '16', '22', '28', '32', '38', '44'] },
    { name: '红单', numbers: ['01', '07', '13', '19', '23', '29', '35', '45'] },
    { name: '红双', numbers: ['02', '08', '12', '18', '24', '30', '34', '40', '46'] },
    { name: '蓝单', numbers: ['03', '09', '15', '25', '31', '37', '41', '47'] },
    { name: '蓝双', numbers: ['04', '10', '14', '20', '26', '36', '42', '48'] }
])

// 十二生肖数据
const zodiacData = [
    { name: '鼠', numbers: ['06', '18', '30', '42'], emoji: '🐭' },
    { name: '牛', numbers: ['05', '17', '29', '41'], emoji: '🐮' },
    { name: '虎', numbers: ['04', '16', '28', '40'], emoji: '🐯' },
    { name: '兔', numbers: ['03', '15', '27', '39'], emoji: '🐰' },
    { name: '龙', numbers: ['02', '14', '26', '38'], emoji: '🐲' },
    { name: '蛇', numbers: ['01', '13', '25', '37', '49'], emoji: '🐍' },
    { name: '马', numbers: ['12', '24', '36', '48'], emoji: '🐴' },
    { name: '羊', numbers: ['11', '23', '35', '47'], emoji: '🐑' },
    { name: '猴', numbers: ['10', '22', '34', '46'], emoji: '🐵' },
    { name: '鸡', numbers: ['09', '21', '33', '45'], emoji: '🐔' },
    { name: '狗', numbers: ['08', '20', '32', '44'], emoji: '🐶' },
    { name: '猪', numbers: ['07', '19', '31', '43'], emoji: '🐷' }
]
const zodiacList = ref(zodiacData)

// 表单验证状态
const isFormValid = computed(() => {
    return numberArray.value.length > 0 && betCount.value > 0 && !errorMessage.value
})

// 是否有选择内容
const hasSelection = computed(() => {
    return selectedNumbers.value.length > 0 ||
        selectedTails.value.length > 0 ||
        selectedZodiacs.value.length > 0 ||
        selectedSpecials.value.length > 0 ||
        selectedHeads.value.length > 0 ||
        numberArray.value.length > 0 ||
        betCount.value > 0
})

// 切换数字选择
const toggleNumberSelection = (num) => {
    if (selectedTails.value.length > 0 || selectedZodiacs.value.length > 0 || selectedSpecials.value.length > 0 || selectedHeads.value.length > 0) {
        errorMessage.value = "请先取消已选的尾数、生肖、特殊选项或头部选择"
        return
    }
    const index = selectedNumbers.value.indexOf(num)
    if (index === -1) {
        selectedNumbers.value.push(num)
    } else {
        selectedNumbers.value.splice(index, 1)
    }
    updateNumbersFromSelection()
}

// 切换尾数选择
const toggleTailSelection = (tail) => {
    if (selectedNumbers.value.length > 0 || selectedZodiacs.value.length > 0 || selectedSpecials.value.length > 0 || selectedHeads.value.length > 0) {
        errorMessage.value = "请先取消已选的号码、生肖、特殊选项或头部选择"
        return
    }

    const index = selectedTails.value.indexOf(tail)
    if (index === -1) {
        selectedTails.value.push(tail)
    } else {
        selectedTails.value.splice(index, 1)
    }
    updateNumbersFromSelection()
}

// 切换头部选择
const toggleHeadSelection = (head) => {
    if (selectedNumbers.value.length > 0 || selectedTails.value.length > 0 || selectedZodiacs.value.length > 0 || selectedSpecials.value.length > 0) {
        errorMessage.value = "请先取消已选的号码、尾数、生肖或特殊选项"
        return
    }

    const index = selectedHeads.value.indexOf(head)
    if (index === -1) {
        selectedHeads.value.push(head)
    } else {
        selectedHeads.value.splice(index, 1)
    }
    updateNumbersFromSelection()
}

// 切换生肖选择
const toggleZodiacSelection = (zodiacName) => {
    if (selectedNumbers.value.length > 0 || selectedTails.value.length > 0 || selectedSpecials.value.length > 0 || selectedHeads.value.length > 0) {
        errorMessage.value = "请先取消已选的号码、尾数、特殊选项或头部选择"
        return
    }

    const index = selectedZodiacs.value.indexOf(zodiacName)
    if (index === -1) {
        selectedZodiacs.value.push(zodiacName)
    } else {
        selectedZodiacs.value.splice(index, 1)
    }
    updateNumbersFromSelection()
}

// 切换特殊选择
const toggleSpecialSelection = (specialName) => {
    if (selectedNumbers.value.length > 0 || selectedTails.value.length > 0 || selectedZodiacs.value.length > 0 || selectedHeads.value.length > 0) {
        errorMessage.value = "请先取消已选的号码、尾数、生肖或头部选择"
        return
    }

    const index = selectedSpecials.value.indexOf(specialName)
    if (index === -1) {
        selectedSpecials.value.push(specialName)
    } else {
        selectedSpecials.value.splice(index, 1)
    }
    updateNumbersFromSelection()
}

// 解析用户输入的生肖名称
const parseZodiacInput = () => {
    if (!zodiacInput.value) {
        selectedZodiacs.value = []
        return
    }
    // 定义所有可能的生肖名称
    const allZodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
    const matchedZodiacs = []

    // 遍历输入内容，查找匹配的生肖
    for (const char of zodiacInput.value) {
        if (allZodiacs.includes(char) && !matchedZodiacs.includes(char)) {
            matchedZodiacs.push(char)
        }
    }

    // 更新选中的生肖
    selectedZodiacs.value = matchedZodiacs
    updateNumbersFromSelection()
}

// 根据选择更新号码数组
const updateNumbersFromSelection = () => {
    errorMessage.value = ''

    if (selectedTails.value.length > 0) {
        // 尾数选择模式
        const numbers = []
        selectedTails.value.forEach((tail) => {
            numbers.push(...tailNumbers[tail] || [])
        })
        inputValue.value = numbers.join(', ')
        numberArray.value = [...new Set(numbers)] // 去重
        selectedNumbers.value = [] // 清空数字选择
        selectedZodiacs.value = [] // 清空生肖选择
        selectedSpecials.value = [] // 清空特殊选择
        selectedHeads.value = [] // 清空头部选择
    } else if (selectedHeads.value.length > 0) {
        // 头部选择模式
        const numbers = []
        selectedHeads.value.forEach((head) => {
            numbers.push(...headNumbers[head] || [])
        })
        inputValue.value = numbers.join(', ')
        numberArray.value = [...new Set(numbers)] // 去重
        selectedNumbers.value = [] // 清空数字选择
        selectedZodiacs.value = [] // 清空生肖选择
        selectedSpecials.value = [] // 清空特殊选择
        selectedTails.value = [] // 清空尾数选择
    } else if (selectedZodiacs.value.length > 0) {
        // 生肖选择模式
        const numbers = []
        selectedZodiacs.value.forEach(zodiacName => {
            const zodiac = zodiacList.value.find(z => z.name === zodiacName)
            if (zodiac) {
                numbers.push(...zodiac.numbers)
            }
        })
        inputValue.value = numbers.join(', ')
        numberArray.value = [...new Set(numbers)] // 去重
        selectedNumbers.value = [] // 清空数字选择
        selectedSpecials.value = [] // 清空特殊选择
        selectedTails.value = [] // 清空尾数选择
        selectedHeads.value = [] // 清空头部选择
    } else if (selectedSpecials.value.length > 0) {
        // 特殊选择模式
        const numbers = []
        selectedSpecials.value.forEach(specialName => {
            const special = specialList.value.find(s => s.name === specialName)
            if (special) {
                numbers.push(...special.numbers)
            }
        })
        inputValue.value = numbers.join(', ')
        numberArray.value = [...new Set(numbers)] // 去重
        selectedNumbers.value = [] // 清空数字选择
        selectedTails.value = [] // 清空尾数选择
        selectedHeads.value = [] // 清空头部选择
    } else if (selectedNumbers.value.length > 0) {
        // 数字按钮选择模式
        const numbers = selectedNumbers.value.map(num => num < 10 ? `0${num}` : `${num}`)
        inputValue.value = numbers.join(', ')
        numberArray.value = numbers
        selectedHeads.value = [] // 清空头部选择
    } else {
        // 无选择模式
        inputValue.value = ''
        numberArray.value = []
    }
}

// 处理注数输入
const processBetCount = () => {
    errorMessage.value = ''
    // 验证注数
    if (isNaN(betCount.value)) {
        errorMessage.value = "注数必须是有效的数字"
        betCount.value = 0
        return
    }
    if (betCount.value <= 0 || !Number.isInteger(betCount.value)) {
        errorMessage.value = "注数必须是正整数"
        betCount.value = 0
        return
    }
    const MAX_BET_COUNT = 9999
    if (betCount.value > MAX_BET_COUNT) {
        errorMessage.value = `注数不能超过 ${MAX_BET_COUNT}`
        betCount.value = MAX_BET_COUNT
        return
    }
    // 添加自定义注数按钮
    if (betCount.value > 0 && !fixedQuickBetCounts.includes(betCount.value)) {
        // 移除旧的自定义注数
        if (customBetCount.value !== null) {
            const index = quickBetCounts.value.indexOf(customBetCount.value)
            if (index !== -1) {
                quickBetCounts.value.splice(index, 1)
            }
        }
        // 添加新的自定义注数
        quickBetCounts.value.push(betCount.value)
        customBetCount.value = betCount.value
    }
}

// 处理数字输入
const processNumbers = () => {
    errorMessage.value = ''
    selectedTails.value = [] // 手动输入时取消尾数选择
    selectedZodiacs.value = [] // 手动输入时取消生肖选择
    selectedSpecials.value = [] // 手动输入时取消特殊选择
    selectedHeads.value = [] // 手动输入时取消头部选择
    const numbers = inputValue.value.match(/\d+/g)
    if (numbers) {
        // 验证数字范围
        for (const num of numbers) {
            const numInt = parseInt(num, 10)
            if (numInt < 1 || numInt > 49) {
                errorMessage.value = `错误：数字 "${num}" 不是有效的两位数（01-49）`
                numberArray.value = []
                return
            }
        }
        // 格式化为两位数
        numberArray.value = numbers.map(num => {
            const numInt = parseInt(num, 10)
            return numInt < 10 ? `0${numInt}` : `${numInt}`
        })
    } else {
        numberArray.value = []
    }
}

// 设置注数
const setBetCount = (count) => {
    betCount.value = count
    errorMessage.value = ""
}

// 提交处理
const handleSubmit = async () => {

    if (!isFormValid.value) return
    // 确定下注类型和备注
    let betType = '直选'
    let betTarget = ''
    let description = ''
    let inputValue = ''

    if (selectedTails.value.length > 0) {
        betType = '包头尾'
        betTarget = selectedTails.value.map(t => t === 0 ? '0' : t.toString()).join(', ')
        description = `${betTarget}尾 `
    } else if (selectedHeads.value.length > 0) {
        betType = '包头尾'
        betTarget = selectedHeads.value.map(h => h.toString()).join(', ')
        description = `${betTarget}头`
    } else if (selectedZodiacs.value.length > 0) {
        betType = '包肖'
        betTarget = selectedZodiacs.value.join(', ')
        description = `包肖 ${betTarget}`
    } else if (selectedSpecials.value.length > 0) {
        betType = 'special'
        betTarget = selectedSpecials.value.join(', ')
        description = `${betTarget}`
    } else {
        description = '直选'
    }
    //头
    if (description == '直选') {
        inputValue = `${numberArray.value.join(',')}各数${betCount.value}`
    } else if (betType == 'special') {
        inputValue = `${description}各数${betCount.value}`
        if (description.includes('波') || description.includes('红') || description.includes('蓝') || description.includes('绿')) {
            betType = '波色'
        } else if (description.includes('单') || description.includes('双')) {
            betType = '单双'
        } else if (description.includes('大') || description.includes('小')) {
            betType = '大小'
        }
    } else if (betType == '包肖') {
        inputValue = `${betTarget}各数${betCount.value}`
    } else if (betType == '包头尾') {
        inputValue = `${description}各数${betCount.value}`
    }

    const bet = {
        index: 1,
        inputValue: inputValue,//输入
        selectedNumbers: numberArray.value,  //选择的号码
        amount: betCount.value, //金额
        totalAmount: numberArray.value.length * betCount.value, //总金额
        isValid: true, //合格
        type: betType,  //方式
        description: description,
    }
    dialog.success({
        title: '确定投注?',
        content: `${bet.type}${betTarget}  :  ${bet.selectedNumbers.join(',')} 各数投注${bet.amount}元,总金额${bet.totalAmount}`,
        positiveText: '确定',
        negativeText: '取消',
        maskClosable: false,
        onPositiveClick: () => {
            gameStore.place(bet)
        },
        onNegativeClick: () => {
            message.warning('取消')
        }
    })



    // 重置表单
    // resetForm()
}

const resetForm = () => {
    inputValue.value = ''
    numberArray.value = []
    betCount.value = 0
    selectedTails.value = []
    selectedZodiacs.value = []
    selectedNumbers.value = []
    selectedSpecials.value = []
    selectedHeads.value = []
    zodiacInput.value = ''
    errorMessage.value = ''
}
</script>

<style scoped>
/* 基础样式 */
.bet-app {
    --primary-color: #3B82F6;
    --primary-hover: #2563EB;
    --success-color: #10B981;
    --danger-color: #EF4444;
    --warning-color: #F59E0B;
    --gray-100: #F8FAFC;
    --gray-200: #E2E8F0;
    --gray-300: #CBD5E1;
    --gray-400: #94A3B8;
    --gray-500: #64748B;
    --gray-600: #475569;
    --gray-700: #334155;
    --gray-800: #1E293B;
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --transition: all 0.2s ease;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.5;
    color: var(--gray-800);
}

/* 布局样式 */
.bet-layout {
    display: flex;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.5rem;
}

.bet-control-panel {
    flex: 1;
    min-width: 0;
    background: white;
    border-radius: 1rem;
    padding: 0.5rem;
    box-shadow: var(--shadow-md);
}

.bet-history-panel {
    flex: 0 0 500px;
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    max-height: calc(100vh - 3rem);
    display: flex;
    flex-direction: column;
}

.panel-header {
    margin-bottom: 1.5rem;
}

.panel-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 0 0 0.25rem 0;
}

.panel-subtitle {
    font-size: 0.875rem;
    color: var(--gray-500);
}

/* 输入组样式 */
.input-group {
    margin-bottom: 1.25rem;
}

.input-label {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
}

.input-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
}

.bet-input {
    width: 80%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--gray-200);
    border-radius: 0.75rem;
    font-size: 0.9375rem;
    transition: var(--transition);
    background-color: var(--gray-100);
    color: var(--gray-800);
}

.bet-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    background-color: white;
}

.bet-input::placeholder {
    color: var(--gray-400);
}

/* 数字选择器 */
.number-selector,
.quick-selector {
    margin-bottom: 1.5rem;
    background: var(--gray-100);
    border-radius: 0.75rem;
    padding: 1rem;
}

.selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.selector-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--gray-700);
}

.selector-count {
    font-size: 0.55rem;
    color: var(--primary-color);
    background: rgba(59, 130, 246, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
}

.number-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 0.5rem;
}

.number-btn {
    position: relative;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: var(--transition);
    padding: 0;
    overflow: hidden;
}

.number-btn:hover:not(.disabled) {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.number-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.number-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.number-text {
    font-size: 0.875rem;
    font-weight: 500;
    transition: var(--transition);
}

.number-btn.active .number-text {
    color: white;
}

.number-check {
    position: absolute;
    top: 0;
    right: 0;
    width: 1rem;
    height: 1rem;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom-left-radius: 0.5rem;
    opacity: 0;
    transform: translateY(-100%);
    transition: var(--transition);
}

.number-btn.active .number-check {
    opacity: 1;
    transform: translateY(0);
}

.number-check svg {
    width: 0.75rem;
    height: 0.75rem;
}

/* 快捷选择器 */
.quick-btn-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.quick-btn {
    padding: 0.5rem 0.75rem;
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.quick-btn:hover:not(.disabled) {
    border-color: var(--primary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}

.quick-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

.quick-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.zodiac-btn .zodiac-icon {
    font-size: 1rem;
}

/* 头部选择器样式 */
.head-selector .quick-btn-group {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
}

@media (max-width: 480px) {
    .head-selector .quick-btn-group {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* 特殊选择器样式 */
.special-selector .quick-btn-group {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .special-selector .quick-btn-group {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 480px) {
    .special-selector .quick-btn-group {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* 快速注数按钮 */
.bet-amount-group {
    position: relative;
}

.quick-bet-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.quick-bet-btn {
    padding: 0.5rem 0.75rem;
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 0.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
}

.quick-bet-btn:hover {
    border-color: var(--primary-color);
}

.quick-bet-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
}

/* 结果卡片 */
.result-card {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 0.75rem;
    padding: 1.25rem;
    margin-bottom: 1.25rem;
    transition: var(--transition);
}

.result-card:hover {
    box-shadow: var(--shadow-sm);
}

.result-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-weight: 500;
    color: var(--gray-700);
}

.result-icon {
    width: 1.25rem;
    height: 1.25rem;
}

.number-badge-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.number-badge {
    background: var(--primary-color);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.8125rem;
    font-weight: 500;
    box-shadow: var(--shadow-sm);
}

.bet-summary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
}

.summary-label {
    color: var(--gray-600);
}

.summary-value {
    font-weight: 600;
    color: var(--gray-800);
}

.summary-item.total {
    padding-top: 0.5rem;
    border-top: 1px dashed var(--gray-200);
}

.summary-item.total .summary-value {
    color: var(--primary-color);
    font-size: 1rem;
}

/* 错误卡片 */
.error-card {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1.25rem;
}

.error-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
    margin-top: 0.125rem;
}

.error-content {
    flex: 1;
}

.error-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--danger-color);
    margin: 0 0 0.25rem 0;
}

.error-message {
    font-size: 0.8125rem;
    color: var(--gray-700);
    margin: 0;
}

/* 提交按钮 */
.submit-btn {
    width: 60%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow-md);
}

.submit-btn:hover:not(:disabled) {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(0);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: var(--gray-300);
}

.btn-text {
    flex: 1;
    text-align: center;
}

.btn-amount {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
}

/* 按钮组样式 */
.button-group {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.reset-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: white;
    color: var(--danger-color);
    border: 1px solid var(--danger-color);
    border-radius: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
}

.reset-btn:hover:not(:disabled) {
    background: #FEE2E2;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.reset-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--gray-100);
    color: var(--gray-400);
    border-color: var(--gray-300);
}

/* 生肖输入框样式 */
.zodiac-input-group {
    margin-top: 12px;
}

.zodiac-input {
    width: 90%;
    padding: 10px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
}

.zodiac-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.zodiac-input::placeholder {
    color: #94a3b8;
    font-size: 13px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .bet-layout {
        flex-direction: column;
    }

    .bet-history-panel {
        flex: 1;
        max-width: 100%;
    }
}

@media (max-width: 768px) {
    .number-grid {
        grid-template-columns: repeat(8, 1fr);
    }

    .quick-bet-buttons {
        grid-template-columns: repeat(4, 1fr);
    }
    
}

@media (max-width: 480px) {
    .bet-layout {
        padding: 1rem;
    }

    .bet-control-panel,
    .bet-history-panel {
        padding: 1rem;
    }

    .number-grid {
        grid-template-columns: repeat(5, 1fr);
    }

    .quick-btn-group {
        justify-content: center;
    }

    .submit-btn {
        padding: 0.175rem;
    }
}
</style>