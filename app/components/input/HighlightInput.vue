<template>
  <div class="highlight-input-container">
    <input
      ref="inputRef"
      v-model="inputValue"
      class="highlight-input"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  highlightWords: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '请输入...'
  }
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)
const inputValue = ref(props.modelValue)
const isFocused = ref(false)

// 处理输入事件
const handleInput = (e) => {
  inputValue.value = e.target.value
  emit('update:modelValue', inputValue.value)
  updateHighlightStyles()
}

// 更新高亮样式
const updateHighlightStyles = () => {
  if (!inputRef.value || !props.highlightWords.length) return
  
  // 重置所有样式
  inputRef.value.style.setProperty('--highlight-bg', 'transparent')
  inputRef.value.style.setProperty('--highlight-color', 'inherit')
  
  if (!inputValue.value) return
  
  const regex = new RegExp(`(${props.highlightWords.join('|')})`, 'gi')
  let match
  const ranges = []
  
  // 找到所有匹配的范围
  while ((match = regex.exec(inputValue.value)) !== null) {
    ranges.push({
      start: match.index,
      end: match.index + match[0].length
    })
  }
  
  if (ranges.length === 0) return
  
  // 创建CSS规则
  let rule = ''
  ranges.forEach((range, index) => {
    const start = range.start
    const end = range.end
    rule += `@supports (background: paint(highlight)) {
      @starting-style {
        ::highlight(highlight-${index}) {
          background-color: var(--highlight-bg, #ffeb3b);
          color: var(--highlight-color, #000);
        }
      }
      ::highlight(highlight-${index}) {
        background-color: var(--highlight-bg, #ffeb3b);
        color: var(--highlight-color, #000);
      }
    }`
  })
  
  // 动态创建样式表
  const style = document.createElement('style')
  style.textContent = rule
  document.head.appendChild(style)
  
  // 设置文本范围高亮
  const highlight = new Highlight()
  ranges.forEach((range, index) => {
    const textNode = inputRef.value
    const rangeObj = new Range()
    rangeObj.setStart(textNode, range.start)
    rangeObj.setEnd(textNode, range.end)
    highlight.add(rangeObj)
    CSS.highlights.set(`highlight-${index}`, highlight)
  })
}

// 监听外部 modelValue 变化
watch(() => props.modelValue, (newVal) => {
  if (newVal !== inputValue.value) {
    inputValue.value = newVal
    updateHighlightStyles()
  }
})

// 组件挂载后初始化高亮
onMounted(() => {
  updateHighlightStyles()
})
</script>

<style>
.highlight-input-container {
  position: relative;
  width: 100%;
}

.highlight-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  color: #606266;
  font-family: inherit;
  font-size: inherit;
}

.highlight-input:focus {
  outline: none;
  border-color: #409eff;
}

/* 回退样式，如果浏览器不支持CSS Custom Highlight API */
@supports not (background: paint(highlight)) {
  .highlight-input {
    background-image: linear-gradient(
      to right,
      var(--highlight-bg, transparent) 0%,
      var(--highlight-bg, transparent) 100%
    );
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>