<template>
  <div class="game-sessions-container">
    <div class="header">
      <div class="header-content">
        <h2 class="header-title">场次管理</h2>
        <p class="header-subtitle">管理当前所有游戏场次信息</p>
      </div>
      <button class="btn-create" @click="openCreateSessionDialog">
        <i class="icon-add">+</i> 创建新场次
      </button>
    </div>

    <div class="sessions-list">
      <div v-if="gameStore.sessions.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 4V6M12 18V20M6 12H4M20 12H18M7.757 7.757L6.343 6.343M16.243 16.243L17.657 17.657M7.757 16.243L6.343 17.657M16.243 7.757L17.657 6.343"
              stroke="#888" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
        <p class="empty-text">暂无场次数据</p>
        <button class="btn-create" @click="openCreateSessionDialog">
          <i class="icon-add">+</i> 创建第一个场次
        </button>
      </div>

      <div v-else class="sessions-grid">
        <div class="session-card" v-for="session in gameStore.sessions" :key="session.id">
          <div class="session-header">
            <div class="session-title">
              <h3>{{ session.name }}</h3>
              <span class="session-id">ID: {{ session.id }}</span>
            </div>
            <div class="session-status" :class="{ 'active': session.status === 'active' }">
              {{ session.status === 'active' ? '进行中' : '已结束' }}
            </div>
          </div>

          <div class="session-details">
            <div class="detail-row">
              <span class="detail-label">特码:</span>
              <span class="detail-value highlight">{{ session.specialCode }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">平码:</span>
              <span class="detail-value">
                <span class="code-badge" v-for="code in session.flatCodes" :key="code">{{ code }}</span>
              </span>
            </div>

            <div class="detail-row">
              <span class="detail-label">总金额:</span>
              <span class="detail-value amount">¥{{ formatAmount(session.totalAmount) }}</span>
            </div>

            <div class="detail-row">
              <span class="detail-label">创建时间:</span>
              <span class="detail-value">{{ formatDate(session.createdAt) }}</span>
            </div>
          </div>

          <div class="session-actions">
            <button class="btn-action edit" @click="openEditSession(session)">
              <i class="icon-edit">✏️</i> 编辑
            </button>
            <button class="btn-action view" @click="viewSessionDetails(session)">
              <i class="icon-view">👁️</i> 详情
            </button>
            <button class="btn-action danger" @click="confirmDeleteSession(session.id)">
              <i class="icon-delete">🗑️</i> 删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 创建/编辑场次对话框 -->
    <SessionDialog v-if="showSessionDialog" :session="currentSession" :isEdit="isEditMode" :visible="showSessionDialog"
      @close="closeSessionDialog" @save="saveSession" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import SessionDialog from '@/components/dialog/SessionDialog.vue'
import { createDiscreteApi } from 'naive-ui'

const router = useRouter()

const { dialog, message } = createDiscreteApi(['dialog', 'message'])
const gameStore = useGameStore()

onMounted(() => {
  console.log(gameStore.sessions)
})

// 对话框状态
const showSessionDialog = ref(false)
const isEditMode = ref(false)
const currentSession = ref(null)
const sessionToDelete = ref(null)

// 打开创建场次对话框
const openCreateSessionDialog = () => {
  currentSession.value = {
    name: '',
    flatCodes: [],
    specialCode: '',
    flatCodeOdds: 2,
    specialCodeOdds: 47,
    betRecords: [],
    operationRecords: [],
    totalAmount: 0,
    numbers: Array.from({ length: 49 }, (_, i) => ({
      number: (i + 1).toString().padStart(2, '0'),
      amount: 0,
      odds: 0
    })),
    status: 'active'
  }
  isEditMode.value = false
  showSessionDialog.value = true
}

// 打开编辑场次对话框
const openEditSession = (session) => {
  currentSession.value = JSON.parse(JSON.stringify(session))
  isEditMode.value = true
  showSessionDialog.value = true
}

// 查看详情
const viewSessionDetails = async (session) => {
  try {
    if (!session?.id) {
      throw new Error('无效的场次ID')
    }
    await gameStore.setCurrentSession(session.id)
    await router.push('/operation')
  } catch (error) {
    console.error('查看场次详情失败:', error)
    const errorMessage = error.message.includes('不存在')
      ? '场次不存在'
      : '加载场次详情失败，请重试'
    message.error(errorMessage)
  }
}

// 确认删除场次
const confirmDeleteSession = (sessionId) => {
  sessionToDelete.value = sessionId
  dialog.warning({
    title: '删除确认',
    content: '确定要删除此场次吗？此操作不可撤销。',
    positiveText: '确定删除',
    negativeText: '取消',
    maskClosable: false,
    onPositiveClick: () => {
      gameStore.deleteSession(sessionToDelete.value)
      message.success('场次删除成功')
    },
    onNegativeClick: () => {
      message.info('已取消删除操作')
    }
  })
}

// 保存场次
const saveSession = (sessionData) => {
  if (isEditMode.value) {
    
    gameStore.saveSession(sessionData)
    message.success('场次更新成功')
  } else {
    gameStore.createNewSession(sessionData)
    message.success('新场次创建成功')
  }
  closeSessionDialog()
}

// 关闭对话框
const closeSessionDialog = () => {
  showSessionDialog.value = false
}

// 格式化日期
const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleString('zh-CN', options)
}

// 格式化金额
const formatAmount = (amount) => {
  return Number(amount).toLocaleString('zh-CN')
}
</script>

<style scoped>
.game-sessions-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeaea;
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.header-subtitle {
  font-size: 14px;
  color: #666;
  margin: 4px 0 0;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

.btn-create:hover {
  background-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.3);
}

.icon-add {
  font-weight: bold;
  font-size: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background-color: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e7eb;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 24px;
}

.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.session-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 20px;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.session-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.session-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.session-id {
  font-size: 12px;
  color: #6b7280;
  display: block;
  margin-top: 4px;
}

.session-status {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f3f4f6;
  color: #6b7280;
}

.session-status.active {
  background-color: #ecfdf5;
  color: #059669;
}

.session-details {
  margin-bottom: 20px;
  flex: 1;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.detail-label {
  font-size: 14px;
  color: #6b7280;
  width: 80px;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: #111827;
  word-break: break-word;
}

.highlight {
  font-weight: 600;
  color: #4f46e5;
}

.amount {
  font-weight: 600;
  color: #10b981;
}

.code-badge {
  display: inline-block;
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 2px 8px;
  border-radius: 6px;
  margin-right: 6px;
  margin-bottom: 4px;
  font-size: 12px;
}

.session-actions {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.btn-action {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: translateY(-1px);
}

.btn-action.edit {
  background-color: #e0e7ff;
  color: #4f46e5;
}

.btn-action.edit:hover {
  background-color: #c7d2fe;
}

.btn-action.view {
  background-color: #e0f2fe;
  color: #0ea5e9;
}

.btn-action.view:hover {
  background-color: #bae6fd;
}

.btn-action.danger {
  background-color: #fee2e2;
  color: #ef4444;
}

.btn-action.danger:hover {
  background-color: #fecaca;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .sessions-grid {
    grid-template-columns: 1fr;
  }

  .session-actions {
    flex-direction: column;
  }

  .btn-create {
    width: 100%;
    justify-content: center;
  }
}
</style>