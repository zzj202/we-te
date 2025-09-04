<template>
  <div class="user-info" :class="{ 'collapsed': isCollapsed }">
    <div class="avatar-container">
      <div class="avatar" :title="isCollapsed ? '管理员\n超级管理员' : ''">
        <span class="avatar-icon">👨‍💼</span>
        <div v-if="!isCollapsed" class="status-indicator"></div>
      </div>
    </div>
    
    <transition name="user-details">
      <div v-if="!isCollapsed" class="user-details">
        <div class="username">管理员</div>
        <div class="user-role">超级管理员</div>
      </div>
    </transition>
    
    <div v-if="!isCollapsed" class="user-actions">
      <button class="action-btn" title="设置">
        <span class="action-icon">⚙️</span>
      </button>
      <button class="action-btn" title="退出">
        <span class="action-icon">🚪</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.user-info {
  --avatar-size: 40px;
  --avatar-color: #3b82f6;
  --status-color: #10b981;
  --text-color: rgba(255, 255, 255, 0.9);
  --secondary-text: rgba(255, 255, 255, 0.6);
  --bg-hover: rgba(255, 255, 255, 0.1);
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: var(--transition);
}

.user-info:hover {
  background-color: var(--bg-hover);
}

.user-info.collapsed {
  justify-content: center;
  padding: 12px 0;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  background: linear-gradient(135deg, var(--avatar-color), #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.avatar-icon {
  font-size: 24px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: var(--status-color);
  border-radius: 50%;
  border: 2px solid #1e293b;
}

.user-details {
  flex: 1;
  overflow: hidden;
  min-width: 0;
}

.username {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 2px;
}

.user-role {
  font-size: 12px;
  color: var(--secondary-text);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--secondary-text);
  cursor: pointer;
  transition: var(--transition);
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  transform: scale(1.1);
}

.action-icon {
  font-size: 14px;
}

.user-details-enter-active,
.user-details-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.user-details-enter-from,
.user-details-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.user-details-enter-to,
.user-details-leave-from {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 768px) {
  .user-info {
    padding: 8px;
  }
  
  .user-actions {
    display: none;
  }
}
</style>