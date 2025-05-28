<template>
  <aside class="sidebar" :class="{ collapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <img
          src="https://images.pexels.com/photos/9811716/pexels-photo-9811716.jpeg?auto=compress&cs=tinysrgb&w=100"
          alt="Logo"
          class="logo"
        />
        <span v-if="!collapsed" class="logo-text">E-Commerce Admin</span>
      </div>
      <button class="collapse-toggle" @click="$emit('toggle')">
        <i :class="collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" :class="{ 'icon-only': collapsed }">
        <i class="pi pi-home"></i>
        <span v-if="!collapsed">Dashboard</span>
      </router-link>

      <router-link
        to="/revenue"
        class="nav-item"
        :class="{ 'icon-only': collapsed }"
      >
        <i class="pi pi-chart-bar"></i>
        <span v-if="!collapsed">Revenue Analysis</span>
      </router-link>

      <router-link
        to="/inventory"
        class="nav-item"
        :class="{ 'icon-only': collapsed }"
      >
        <i class="pi pi-box"></i>
        <span v-if="!collapsed">Inventory Management</span>
      </router-link>

      <router-link
        to="/products/add"
        class="nav-item"
        :class="{ 'icon-only': collapsed }"
      >
        <i class="pi pi-plus-circle"></i>
        <span v-if="!collapsed">Add Product</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="footer-item" :class="{ 'icon-only': collapsed }">
        <i class="pi pi-cog"></i>
        <span v-if="!collapsed">Settings</span>
      </div>

      <div class="footer-item" :class="{ 'icon-only': collapsed }">
        <i class="pi pi-sign-out"></i>
        <span v-if="!collapsed">Logout</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  collapsed: boolean;
}>();

defineEmits(["toggle"]);
</script>

<style scoped lang="scss">
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: var(--color-grey-900);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal) ease;
  position: sticky;
  top: 0;
  z-index: 20;

  &.collapsed {
    width: 70px;
  }
}

.sidebar-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
}

.logo-text {
  font-weight: 600;
  font-size: var(--font-size-md);
  white-space: nowrap;
}

.collapse-toggle {
  background: none;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast) ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-3) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  color: var(--color-grey-400);
  transition: all var(--transition-fast) ease;
  text-decoration: none;

  i {
    font-size: 1.25rem;
    min-width: 24px;
    text-align: center;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
  }

  &.active {
    background-color: var(--color-primary);
    color: white;
  }

  &.icon-only {
    justify-content: center;
    padding: var(--space-2);
  }
}

.sidebar-footer {
  padding: var(--space-3) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  color: var(--color-grey-400);
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  i {
    font-size: 1.25rem;
    min-width: 24px;
    text-align: center;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
  }

  &.icon-only {
    justify-content: center;
    padding: var(--space-2);
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    box-shadow: var(--shadow-lg);

    &.collapsed {
      transform: translateX(0);
      width: 70px;
    }
  }
}
</style>
