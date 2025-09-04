<template>
  <div class="data-container">
    <div class="header">
      <h2>近期开奖数据</h2>
      <div class="divider"></div>
    </div>
    
    <div class="data-grid">
      <div v-for="item in limitedLotteryData" :key="item.issue" class="data-card">
        <div class="card-header">
          <span class="date">{{ item.date }}</span>
          <span class="issue">第{{ item.issue }}期</span>
        </div>
        <div class="numbers-row">
          <div 
            v-for="(num, index) in item.numbers" 
            :key="index" 
            class="number-container"
            :class="{ 'special-number': index === item.numbers.length - 1 }"
          >
            <div class="number-ball">
           {{ formatNumber(num) }}
            </div>
            <div class="zodiac-sign">{{ getZodiac(num) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import cars from '@/assets/car.json';

const lotteryData = ref(cars);

// 只取前30条数据
const limitedLotteryData = computed(() => {
  return lotteryData.value.slice(0, 10);
});
// 数字格式化，1-9补零
const formatNumber = (num) => {
  return num.toString().padStart(2, '0');
};
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

// 获取号码对应的生肖
const getZodiac = (num) => {
  const numStr = num.toString().padStart(2, '0');
  for (const [zodiac, numbers] of Object.entries(ZODIAC_MAP)) {
    if (numbers.includes(numStr)) {
      return zodiac;
    }
  }
  return '';
};
</script>

<style scoped>
.data-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

h2 {
  color: #333;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.divider {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #e74c3c);
  margin: 0 auto;
  border-radius: 3px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(420px, 1fr));
  gap: 25px;
}

.data-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.date {
  color: #555;
  font-size: 15px;
  font-weight: 500;
}

.issue {
  color: #888;
  font-size: 14px;
  font-weight: 400;
}

.numbers-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.number-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.number-ball {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 600;
  font-size: 16px;
  color: white;
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.special-number .number-ball {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  width: 44px;
  height: 44px;
  font-weight: 700;
}

.zodiac-sign {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}
</style>