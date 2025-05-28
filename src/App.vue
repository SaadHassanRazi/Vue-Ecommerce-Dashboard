<template>
  <div class="app-container" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <Sidebar :collapsed="sidebarCollapsed" @toggle="toggleSidebar" />
    <div class="main-content">
      <Header :title="currentPageTitle" @toggle-sidebar="toggleSidebar" />
      <main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

// Map routes to page titles
const pageTitles: Record<string, string> = {
  'dashboard': 'Dashboard',
  'revenue': 'Revenue Analysis',
  'inventory': 'Inventory Management',
  'products': 'Product Management',
  'add-product': 'Add New Product'
}

const currentPageTitle = computed(() => {
  const routeName = route.name as string
  return pageTitles[routeName] || 'E-commerce Admin'
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Handle responsive behavior
const handleResize = () => {
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
}

// Add event listener on component mount (client-side only)
if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize)
  // Initial check
  handleResize()
}
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  min-height: 100vh;
  transition: all var(--transition-normal) ease;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: margin-left var(--transition-normal) ease;
}

main {
  padding: var(--space-4);
  flex: 1;
  overflow-y: auto;
  background-color: var(--color-grey-100);
}

@media (max-width: 768px) {
  .app-container {
    position: relative;
  }
  
  .main-content {
    width: 100%;
  }
}
</style>