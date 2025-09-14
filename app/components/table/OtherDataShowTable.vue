<template>
  <div class="card-container">
    <!-- 总金额汇总 -->
    <div class="total-summary">
      <div class="total-amount">
        <div class="total-all-amount">总金额: {{ formatAmount(totalAmount) }}</div>
        <div class="total-pao-amount" v-if="gameStore.currentSession.totalAmount">
          剩余金额：{{formatAmount(gameStore.currentSession.totalAmount - gameStore.currentSession.numbers.reduce((total,
            num) => total + num.paoAmount, 0))}}
        </div>
      </div>
      <div v-if="showType == 'new'" class="button-container">
        <button class="column-btn" @click="changeCol">{{ col }}列</button>
      </div>
      <div class="button-container">
        <button class="column-pao-btn" @click="checkPao()">{{ paoShow ? '关闭剩抛' : '显示剩抛' }}</button>
      </div>
      <div class="button-container">
        <button class="column-change-btn" @click="changeShowType()">切换</button>
      </div>

      <div class="button-container">
        <button class="column-load-btn" @click="load">刷新</button>
      </div>

      <!-- <div class="button-container">
        <button class="column-past-btn" @click="checkPast()">{{ pastShow ? '关闭往期' : '打开往期' }}</button>
      </div> -->
    </div>
    <div v-if="pastShow">
      <PastCarShowTable></PastCarShowTable>
      <div class="button-container">
        <button class="column-past-btn" @click="checkPast()">关闭往期</button>
      </div>
    </div>

    <!-- 金额排序展示 -->
    <div v-if="showType == 'new'" class="section">
      <div class="card-grid">
        <div v-for="(item, index) in amountSortedData" :key="'amount-' + index">
          <OtherCardItem :number="item.number.toString().padStart(2, '0')" :zodiac="getZodiac(item.number)"
            :amount="item.amount"></OtherCardItem>
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
                  <OtherCardItem :number="item.number.toString().padStart(2, '0')" :zodiac="getZodiac(item.number)"
                    :amount="item.amount"></OtherCardItem>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showType == 'old'">
      <OldDataShowTable v-model:paoShow="paoShow"></OldDataShowTable>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { createDiscreteApi } from 'naive-ui'
import OtherCardItem from '../item/OtherCardItem.vue';
import OldDataShowTable from './OldDataShowTable.vue';
import PastCarShowTable from './PastCarShowTable.vue';

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

const { dialog, message, loadingBar, notification } = createDiscreteApi(
  ['dialog', 'message', 'loadingBar', 'notification']
)
// 扩展dayjs插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 设置为中文

const gameStore = useGameStore()
const col = ref(1)
const showType = ref('old')
const pastShow = ref(false)
const paoShow = ref(false)
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
});

// // 定时器变量
// let intervalId = null;
// onMounted(() => {
//   // // 设置定时器，每10秒执行一次
//   // intervalId = setInterval(() => {
//   //   console.log('定时执行，当前时间:', new Date().toLocaleTimeString());
//   //   // 这里可以添加你需要的其他逻辑
//   // }, 1000); // 10000毫秒 = 10秒
// });

// onUnmounted(() => {
//   // 组件卸载时清除定时器
//   if (intervalId) {
//     clearInterval(intervalId);
//   }
// });
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
  // notification.success({
  //   title: '有更新！',
  //   content: `总金额有变化，请刷新`,
  //   meta: `${dayjs().format('HH:mm:ss')}`,
  //   onAfterLeave: () => {
  //   }
  // })
  const oldS = gameStore.currentSession
  try {
    await gameStore.loadSessions()
    const newS = gameStore.currentSession

    console.log(oldS)
    if (oldS.totalAmount == newS.totalAmount) {
      message.warning('当前数据金额未发生更改', { duration: 1000 })
    } else {
      message.success(`刷新成功~金额由 ${formatAmount(oldS.totalAmount)} ➡️ ${formatAmount(newS.totalAmount)} ，增加 ${formatAmount(newS.totalAmount - oldS.totalAmount)} `, { duration: 8000 })
      message.success(`最后修改时间${formatFullTime(newS.updatedAt)}(${formatRelativeTime(newS.updatedAt)})`, { duration: 5000 })
    }

  } catch (error) {
  }
}
const changeShowType = () => {
  showType.value = showType.value == 'old' ? 'new' : 'old'
}
const checkPast = () => {
  pastShow.value = !pastShow.value
}
const checkPao = () => {
  paoShow.value = !paoShow.value
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
// 格式化完整时间（用于title提示）
const formatFullTime = (timestamp) => {
  return dayjs(timestamp).format('HH:mm:ss')
}

// 格式化相对时间（显示与当前时间的相对关系）
const formatRelativeTime = (timestamp) => {
  return dayjs(timestamp).fromNow()
}
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}
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
  display: flex;
  align-items: center;
  flex: 1;
  /* 占据剩余空间 */
  text-align: center;
  /* 文本居中 */
  font-size: 18px;
  font-weight: bold;
  color: #4263eb;
}

.total-all-amount {
  margin: 5px 15px;
}

.total-pao-amount {
  color: #07d490;
  font-size: 18px;
  margin: 5px 15px;
}

.button-container {
  margin-left: auto;
  /* 将按钮推到最右边 */
}

.column-load-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #cc0404;
  color: white;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 2px;
}

.column-change-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #07d490;
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(26, 53, 204, 0.1);
  transition: all 0.3s ease;
  margin: 2px;
}

.column-past-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #0a07d4;
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(26, 53, 204, 0.1);
  transition: all 0.3s ease;
  margin: 2px;
}

.column-pao-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #d46307;
  color: white;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(26, 53, 204, 0.1);
  transition: all 0.3s ease;
  margin: 2px;
}

.column-btn {
  padding: 2px 4px;
  border-radius: 4px;
  border: none;
  background-color: #409eff;
  color: white;
  font-size: 18px;
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
  margin-bottom: 5px;
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
  font-size: 12px;
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
  .total-amount {
    display: block;
  }

  .card-grid {
    grid-template-columns: repeat(7, 1fr);
  }

  .zodiac-cards {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>