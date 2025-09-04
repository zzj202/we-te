<template>
  <div class="check-bet-area">
    <div class="mode-selector">
      <button v-for="mode in modes" :key="mode.value" @click="selectMode(mode.value)"
        :class="{ active: selectedMode === mode.value }">
        {{ mode.label }}
      </button>
    </div>

    <div v-if="selectedMode === 'direct'">
      <DirectMode :index="index" />
    </div>
    <div v-else-if="selectedMode === 'zodiac'">
      <ZodiacMode :index="index" />
    </div>
    <div v-else-if="selectedMode === 'tail'">
      <TailMode :index="index"></TailMode>
    </div>
    <div v-else-if="selectedMode === 'colorOddEven'">
      <ColorOddEvenMode :index="index"></ColorOddEvenMode>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import DirectMode from '../mode/DirectMode.vue';
import ZodiacMode from '../mode/ZodiacMode.vue';
import TailMode from '../mode/TailMode.vue';
import ColorOddEvenMode from '../mode/ColorOddEvenMode.vue';

const mainStore = useMainStore();
const props = defineProps({
  index: {
    type: Number,
    required: true
  }
});

// 响应式数据
const selectedMode = ref('direct');
const inputValue = computed(() => {
  const line = mainStore.getAddBetLine(props.index);
  return line?.inputValue || '';
});

// 模式选项
const modes = [
  { label: '直选', value: 'direct' },
  { label: '包肖', value: 'zodiac' },
  { label: '包头尾', value: 'tail' },
  { label: '波色单双', value: 'colorOddEven' },
];

// 自动检测输入内容的模式
const detectedMode = computed(() => {
  const value = inputValue.value.trim();

  if (!value) return 'direct';

  // 生肖检测
  const zodiacKeywords = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const hasZodiac = zodiacKeywords.some(keyword => value.includes(keyword));
  // 包尾检测
  const hasTail = /^[0-9一二三四五六七八九十]尾|^[0-9零一二三四五六七八九]头/.test(value);

  // 波色检测
  const hasColor = /红|蓝|绿|红波|蓝波|绿波|波[红蓝绿]|单|双|[大|小][单|双]|大数|小数/.test(value);

  if (hasZodiac) return 'zodiac';
  if (hasTail) return 'tail';
  if (hasColor) return 'colorOddEven';

  return 'direct';
});

// 监听输入变化，自动更新模式
watch(inputValue, () => {
  selectedMode.value = detectedMode.value;
}, { immediate: true });

// 手动选择模式
const selectMode = (mode) => {
  selectedMode.value = mode;
};
</script>

<style scoped>
.check-bet-area {
  padding: 16px;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin: 10px 0;
  width: 90%;
}

.mode-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
  flex-wrap: wrap;
}

.mode-selector button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.mode-selector button:hover {
  background-color: #f0f0f0;
}

.mode-selector button.active {
  background-color: #409eff;
  color: white;
  border-color: #409eff;
}

.display-area p {
  margin: 0;
  color: #333;
  font-size: 14px;
  padding: 8px 0;
}
</style>