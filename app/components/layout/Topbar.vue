<template>
  <header class="topbar">
    <div class="left-section">
      <button class="toggle-sidebar" @click="$emit('toggle-sidebar')" title="切换菜单">
        <svg class="menu-icon" viewBox="0 0 24 24" width="20" height="20">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor" />
        </svg>
      </button>
      <h2 class="page-title">{{ title }}</h2>
      <div class="session-info" v-if="gameStore.currentSession">
        <span class="current-session">
          场次：{{ gameStore.currentSession.name }}
        </span>
        <span class="total-amount" v-if="gameStore.currentSession.totalAmount">
          总金额：{{ formatAmount(gameStore.currentSession.totalAmount) }}
        </span>
      </div>
    </div>
    <div class="right-section">
      <button class="refresh-btn" @click="refreshPage" title="刷新页面">
        <svg class="refresh-icon" viewBox="0 0 24 24" width="20" height="20">
          <path
            d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            fill="currentColor" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
const gameStore = useGameStore()

defineProps({
  title: {
    type: String,
    default: '仪表盘'
  },
  isMobile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-sidebar', 'logout'])

const refreshPage = () => {
  window.location.reload()
  // 或者使用 Nuxt 的方式：
  // refreshNuxtData() // 如果你只想刷新数据而不是整个页面
}

// 格式化金额显示
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped>
.topbar {
  --topbar-height: 60px;
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --secondary-text: #4b5563;
  --badge-color: #ef4444;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: var(--topbar-height);
  background-color: white;
  box-shadow: var(--shadow);
  z-index: 50;
  position: sticky;
  top: 0;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.toggle-sidebar {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-sidebar:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.menu-icon {
  color: var(--text-color);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.session-info {
  gap: 12px;
  align-items: center;
}

.current-session,
.total-amount {
  font-size: 14px;
  color: var(--secondary-text);
  padding: 8px 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  margin: 2px;
}

.total-amount {
  background-color: #e6f7ff;
  color: #ff0000;
  font-weight: bold;
}

.total-pao-amount {
  background-color: #e6f7ff;
  color: green;
  font-weight: bold;
  padding: 8px;
  margin: 2px;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.refresh-icon {
  color: var(--text-color);
  transition: transform 0.3s ease;
}

.refresh-btn:hover .refresh-icon {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .total-pao-amount {
    display: none;
  }

  .total-amount {
    display: none
  }

  .topbar {
    padding: 0 16px;
  }

  .left-section {
    gap: 12px;
  }

  .page-title {
    font-size: 16px;
  }

  .session-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .current-session,
  .total-amount {
    font-size: 15px;
    padding: 2px 6px;
  }

  .topbar {
    --topbar-height: 40px;
    /* --topbar-height: 60px;
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --secondary-text: #4b5563;
  --badge-color: #ef4444;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: var(--topbar-height);
  background-color: white;
  box-shadow: var(--shadow);
  z-index: 50;
  position: sticky;
  top: 0; */
  }
}
</style>