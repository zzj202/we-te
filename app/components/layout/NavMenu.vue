<template>
  <nav class="nav-menu" :class="{ collapsed: isCollapsed }">
    <NuxtLink 
      v-for="item in menuItems" 
      :key="item.path" 
      :to="item.path"
      class="nav-item"
      active-class="active"
      exact-active-class="exact-active"
      :title="isCollapsed ? item.text : ''"
    >
      <span class="icon">{{ item.icon }}</span>
      <span class="text">{{ item.text }}</span>
      <span class="indicator"></span>
    </NuxtLink>
  </nav>
</template>

<script setup>
const props = defineProps({
  menuItems: {
    type: Array,
    default: () => []
  },
    isCollapsed: {
    type: Boolean,
    default: false
  }
})



</script>

<style scoped>
.nav-menu {
  padding: 12px 0;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
  border-radius: 8px;
  margin: 0 8px;
  overflow: hidden;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
  transform: translateX(4px);
}

.nav-item.active {
  background-color: rgba(59, 130, 246, 0.15);
  color: white;
}

.nav-item.exact-active {
  background-color: rgba(59, 130, 246, 0.25);
  color: white;
  font-weight: 500;
}

.nav-item .icon {
  margin-right: 12px;
  font-size: 18px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-item .text {
  opacity: 1;
  transition: all 0.3s ease;
}

.nav-item .indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #3b82f6;
  transform: scaleY(0);
  transform-origin: center top;
  transition: transform 0.3s ease;
}

.nav-item.active .indicator,
.nav-item.exact-active .indicator {
  transform: scaleY(1);
}

/* 折叠状态样式 */
.nav-menu.collapsed .nav-item {
  padding: 14px;
  justify-content: center;
  margin: 0 4px;
}

.nav-menu.collapsed .nav-item .icon {
  margin-right: 0;
  font-size: 20px;
}

.nav-menu.collapsed .nav-item .text {
  opacity: 0;
  width: 0;
  height: 0;
  overflow: hidden;
}

.nav-menu.collapsed .nav-item:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .nav-menu:not(.collapsed) {
    padding: 8px 0;
  }
  
  .nav-item {
    padding: 12px 16px;
    margin: 0 4px;
  }
}
</style>