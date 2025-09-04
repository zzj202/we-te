<template>

    <div class="card-container">
      <div class="controls">
        <button @click="sortByNumber" :class="{ active: sortMethod === 'number' }">
          编号
        </button>
        <button @click="sortByAmount" :class="{ active: sortMethod === 'amount' }">
          金额
        </button>
        <button @click="sortByZodiac" :class="{ active: sortMethod === 'zodiac' }">
          生肖
        </button>
      </div>

      <div class="card-grid">

        <div v-for="(item, index) in sortedData">
          <CardItem :key="index" :number="item.number.toString().padStart(2, '0')" :zodiac="getZodiac(item.number)"
            :amount="item.amount"></CardItem>
        </div>
      </div>
    </div>

</template>

<script setup>
import { computed, ref } from 'vue';

import CardItem from './item/CardItem.vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

const sortMethod = ref('amount');

const sortByNumber = () => sortMethod.value = 'number';
const sortByAmount = () => sortMethod.value = 'amount';
const sortByZodiac = () => sortMethod.value = 'zodiac';

const sortedData = computed(() => {
  const dataCopy = [...props.data];

  switch (sortMethod.value) {
    case 'number': return dataCopy.sort((a, b) => a.number - b.number);
    case 'amount': return dataCopy.sort((a, b) => b.amount - a.amount);
    case 'zodiac': return dataCopy.sort((a, b) => {
      const zodiacA = getZodiac(a.number);
      const zodiacB = getZodiac(b.number);
      return zodiacA.localeCompare(zodiacB) || a.number - b.number;
    });
    default: return dataCopy;
  }
});

const zodiacNumberMap = {
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

const getZodiac = (number) => {
  const numStr = number.toString().padStart(2, '0');
  for (const [zodiac, numbers] of Object.entries(zodiacNumberMap)) {
    if (numbers.includes(numStr)) return zodiac;
  }
  return '未知';
};


</script>

<style scoped>
.card-container {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  max-width: 100%;
}

.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.controls button {
  padding: 6px 12px;
  border: none;
  border-radius: 16px;
  background-color: #e9ecef;
  color: #495057;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.controls button:hover {
  background-color: #dee2e6;
}

.controls button.active {
  background-color: #4263eb;
  color: white;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .controls button {
    padding: 5px 10px;
    font-size: 13px;
  }
}
</style>