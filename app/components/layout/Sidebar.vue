<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed, 'expanded': !isCollapsed }" @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <div class="logo-area">
      <div class="logo" @click="$emit('toggle')">
        <transition name="logo-text" mode="out-in">
          <span v-if="!isCollapsed" key="full">小鸡毛与小小白</span>
          <span v-else key="short" class="lottery-symbol">🎰</span>
        </transition>
      </div>
    </div>

    <div class="nav-container">
      <NavMenu :menuItems="menuItems" :is-collapsed="isCollapsed" />
    </div>

    <div class="sidebar-footer">
      <UserInfo :is-collapsed="isCollapsed" />
    </div>
  </aside>
</template>

<script setup>
import NavMenu from './NavMenu.vue'
import UserInfo from './UserInfo.vue'

const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  },
  menuItems: {
    type: Array,
    default: () => []
  },
  hoverAutoExpand: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle'])

const handleMouseEnter = () => {
  if (props.hoverAutoExpand && props.isCollapsed) {
    emit('toggle')
  }
}

const handleMouseLeave = () => {
  if (props.hoverAutoExpand && !props.isCollapsed) {
    emit('toggle')
  }
}
</script>

<style scoped>
.sidebar {
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --sidebar-bg-start: #1e293b;
  --sidebar-bg-end: #0f172a;
  --sidebar-text-color: rgba(255, 255, 255, 0.9);
  --sidebar-highlight: #3b82f6;
  --sidebar-border-color: rgba(255, 255, 255, 0.1);
  --sidebar-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  width: var(--sidebar-width);
  height: 100vh;
  background: linear-gradient(180deg, var(--sidebar-bg-start), var(--sidebar-bg-end));
  color: var(--sidebar-text-color);
  transition: var(--sidebar-transition);
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
}

.logo-area {
  position: relative;
  padding: 20px 0;
  border-bottom: 1px solid var(--sidebar-border-color);
}

.logo {
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  padding: 0 20px;
  transition: var(--sidebar-transition);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

.lottery-symbol {
  font-size: 28px;
  display: inline-block;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.7));
}

.logo:hover .lottery-symbol {
  transform: scale(1.2);
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.9));
}

.collapse-btn {
  position: absolute;
  top: 50%;
  right: -12px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-50%);
  transition: var(--sidebar-transition);
  z-index: 10;
}

.collapse-btn:hover {
  background: var(--sidebar-highlight);
  color: white;
}

.collapse-icon {
  font-size: 12px;
  color: #333;
}

.collapse-btn:hover .collapse-icon {
  color: white;
}

.nav-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 0;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid var(--sidebar-border-color);
  background: rgba(0, 0, 0, 0.1);
}

.logo-text-enter-active,
.logo-text-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.logo-text-enter-from,
.logo-text-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.logo-text-enter-to,
.logo-text-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.rotate-icon-enter-active,
.rotate-icon-leave-active {
  transition: transform 0.3s ease;
}

.rotate-icon-enter-from {
  transform: rotate(-180deg);
}

.rotate-icon-leave-to {
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .sidebar:not(.collapsed) {
    width: 50%;
    height: auto;
    position: relative;
  }

  .collapse-btn {
    display: none;
  }
}
</style>