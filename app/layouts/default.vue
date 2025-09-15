<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'mobile-view': isMobile }">
    <Sidebar :is-collapsed="isSidebarCollapsed" :menuItems="menuItems" @toggle="toggleSidebar" class="sidebar" />
    <div class="sidebar-overlay" v-if="isMobile && !isSidebarCollapsed" @click="toggleSidebar"></div>
    <main class="main-content">
      <Topbar :title="currentRouteTitle" :is-mobile="isMobile" @toggle-sidebar="toggleSidebar" />
      <div class="content-wrapper">
        <div class="content-container">
          <slot />
        </div>
      </div>
    </main>
  </div>

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Topbar from '@/components/layout/Topbar.vue'


const isSidebarCollapsed = ref(true)
const isMobile = ref(false)
const route = useRoute()
const menuItems = [
  { path: '/dashboard', text: '仪表盘', icon: '📊' },
  { path: '/sessions', text: '场次管理', icon: '🕒' },
  { path: '/datashow', text: '数据展示', icon: '📈' },
  { path: '/operation', text: '批量加注', icon: '💸' },
  { path: '/oneOperation', text: '单次加注', icon: '💰' },
  { path: '/addHistory', text: '加注记录', icon: '🗃️' },
  { path: '/history', text: '操作记录', icon: '📝' },
  { path: '/settings', text: '系统设置', icon: '⚙️' },
  { path: '/pao', text: '场次抛号', icon: '🍵' }
]

const currentRouteTitle = computed(() => {
  const matchedItem = menuItems.find(item => item.path === route.path)
  return matchedItem?.text || '仪表盘'
})
function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}



function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    isSidebarCollapsed.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.app-layout {
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  --topbar-height: 60px;
  --content-padding: 24px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --bg-color: #f8fafc;
  --content-bg: #ffffff;

  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  position: relative;
}

.sidebar {
  transition: var(--transition);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: var(--transition);
}


.content-wrapper {
  flex: 1;

  overflow-y: hidden;
  height: calc(100vh - var(--topbar-height));
}

.content-container {
  background-color: var(--content-bg);
  border-radius: 12px;
  box-shadow: var(--shadow);
  min-height: 100%;
  height: 0px;
  overflow-y: scroll;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

.app-layout.mobile-view .main-content {
  margin-left: 0;
}

.app-layout.mobile-view .sidebar {
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  transform: translateX(-100%);
  z-index: 1000;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
}

.app-layout.mobile-view .sidebar:not(.collapsed) {
  transform: translateX(0);
}

@media (max-width: 992px) {
  :root {
    --content-padding: 16px;
  }

  .content-container {
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .app-layout {
    --sidebar-width: 0;
    --sidebar-collapsed-width: 0;
  }

  .content-wrapper {
    padding: 0px;
  }

  .content-container {
    border-radius: 8px;
    padding: 0px;
  }
}

@media (max-width: 576px) {
  .content-container {
    border-radius: 0;
    box-shadow: none;
  }
}
</style>