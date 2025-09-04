<template>
  <div class="card-container">
    <!-- 总金额汇总 -->
    <div class="total-summary">
      <div class="total-amount">
        总金额: {{ totalAmount }}
      </div>
      <div v-if="showType == 'new'" class="button-container">
        <button class="column-btn" @click="changeCol">{{ col }}列</button>
      </div>
      <div class="button-container">
        <button class="column-load-btn" @click="load">刷新数据</button>
      </div>
      <div class="button-container">
        <button class="column-change-btn" @click="changeShowType()">切换样式</button>
      </div>
    </div>

    <!-- 金额排序展示 -->
    <div v-if="showType == 'new'" class="section">
      <div class="card-grid">
        <div v-for="(item, index) in amountSortedData" :key="'amount-' + index">
          <WeChatCardItem :number="item.number.toString().padStart(2, '0')" :zodiac="getZodiac(item.number)"
            :amount="item.amount"></WeChatCardItem>
        </div>
      </div>
    </div>
    <!-- 生肖展示 -->
    <div v-if="showType == 'new'" class="section">
      <div class="zodiac-grid">
        <div class="zodiac-container-show">
          <div class="zodiac-column" v-for="(column, colIndex) in zodiacColumns" :key="'zodiac-col-' + colIndex">
            <div class="zodiac-row" v-for="zodiac in column" :key="zodiac">
              <div class="zodiac-cards">
                <div>
                  <div style="font-size: 22px;font-weight: bold;">{{ zodiac }}</div>
                  <div class="zodiac-total">{{ zodiacTotals[zodiac] }}</div>
                </div>
                <div v-for="(item, itemIndex) in groupedByZodiac[zodiac]" :key="'zodiac-item-' + itemIndex">
                  <WeChatCardItem :number="item.number.toString().padStart(2, '0')" :zodiac="getZodiac(item.number)"
                    :amount="item.amount"></WeChatCardItem>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showType == 'old'">
      <OldDataShowTable></OldDataShowTable>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { createDiscreteApi } from 'naive-ui'

import WeChatCardItem from '../item/WeChatCardItem.vue';
import OldDataShowTable from '~/components/table/OldDataShowTable.vue';

const { dialog, message, loadingBar } = createDiscreteApi(
  ['dialog', 'message', 'loadingBar']
)


const showType = ref('old')
const gameStore = useGameStore()
const col = ref(1)
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

// 计算总金额
const totalAmount = computed(() => {
  return props.data.reduce((sum, item) => sum + item.amount, 0);
});

const amountSortedData = computed(() => {
  const dataCopy = [...props.data];
  return dataCopy.sort((a, b) => b.amount - a.amount);
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

const zodiacTotals = computed(() => {
  const totals = {};
  props.data.forEach(item => {
    const zodiac = getZodiac(item.number);
    if (!totals[zodiac]) {
      totals[zodiac] = 0;
    }
    totals[zodiac] += item.amount;
  });

  // 按照金额排序生肖总计
  const sortedTotals = {};
  Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .forEach(([zodiac, total]) => {
      sortedTotals[zodiac] = total;
    });
  return sortedTotals;
});

const groupedByZodiac = computed(() => {
  const groups = {};

  // 先按照金额排序的生肖顺序初始化空数组
  Object.keys(zodiacTotals.value).forEach(zodiac => {
    groups[zodiac] = [];
  });

  // 填充数据
  amountSortedData.value.forEach(item => {
    const zodiac = getZodiac(item.number);
    if (groups[zodiac] !== undefined) {
      groups[zodiac].push(item);
    }
  });

  return groups;
});

const changeCol = () => {
  col.value = col.value === 1 ? 2 : 1
}
const load = async () => {
  const oldS = gameStore.currentSession
  try {
    await gameStore.loadSessions()
    const newS = gameStore.currentSession
    console.log(oldS)
    if (oldS.totalAmount == newS.totalAmount) {
      message.success('当前数据金额未发生更改', { duration: 1000 })
    } else {
      message.success(`数据刷新成功金额由${oldS.totalAmount}➡️${newS.totalAmount}`, { duration: 5000 })
    }

  } catch (error) {

  }
}
const changeShowType = () => {
  showType.value = showType.value == 'old' ? 'new' : 'old'
}
const zodiacColumns = computed(() => {
  const sortedZodiacs = Object.keys(zodiacTotals.value);
  const columnCount = col.value; // 两列布局
  const columns = Array.from({ length: columnCount }, () => []);

  // 按照总金额从高到低排序后分配到两列
  sortedZodiacs.forEach((zodiac, index) => {
    const columnIndex = index % columnCount;
    columns[columnIndex].push(zodiac);
  });
  return columns;
});
</script>

<style scoped>
.card-container {
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  max-width: 100%;
}

.total-summary {
  display: flex;
  justify-content: space-between;
  /* 将子元素分散对齐 */
  align-items: center;
  /* 垂直居中 */
  width: 100%;
  margin-bottom: 2px;
  padding: 2px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.total-amount {
  flex: 1;
  /* 占据剩余空间 */
  text-align: center;
  /* 文本居中 */
  font-size: 30px;
  font-weight: bold;
  color: #4263eb;
}

.button-container {
  margin-left: auto;
  /* 将按钮推到最右边 */
}

.column-load-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #c0c0c0;
  color: white;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 2px;
}

.column-change-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #08d445;
  color: white;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(43, 58, 139, 0.1);
  transition: all 0.3s ease;
  margin: 2px;
}

.column-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #409eff;
  color: white;
  font-size: 30px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 2px;
}

.column-btn:hover {
  background-color: #66b1ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.column-btn:active {
  transform: translateY(1px);
}

.section {
  margin-bottom: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.zodiac-grid {
  width: 100%;
}

.zodiac-container-show {
  display: flex;
  gap: 2px;
}

.zodiac-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.zodiac-row {
  background-color: #fff;
  border-radius: 8px;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zodiac-total {
  color: #4263eb;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 1px;
}

.zodiac-cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2px;
}

@media (max-width: 1200px) {
  .card-grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .zodiac-cards {
    grid-template-columns: repeat(6, 1fr);
  }
}


@media (max-width: 576px) {
  .card-grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .zodiac-cards {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>