<template>
  <header class="header">
    <div class="header-left">
      <button class="menu-toggle" @click="$emit('toggleSidebar')">
        <i class="pi pi-bars"></i>
      </button>
      <h1 class="page-title">{{ title }}</h1>
    </div>
    
    <div class="header-right">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input type="text" placeholder="Search..." />
      </div>
      
      <div class="header-actions">
        <button class="header-button" title="Notifications">
          <i class="pi pi-bell"></i>
          <span class="notification-badge">3</span>
        </button>
        
        <div class="user-menu">
          <img src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100" alt="User" class="user-avatar" />
          <span class="user-name">Admin User</span>
          <i class="pi pi-angle-down"></i>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()

defineEmits(['toggleSidebar'])
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 var(--space-4);
  background-color: white;
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.menu-toggle {
  background: none;
  border: none;
  color: var(--color-grey-700);
  font-size: 1.25rem;
  margin-right: var(--space-3);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-grey-200);
  }
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: 500;
  color: var(--color-grey-900);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.search-box {
  position: relative;
  
  i {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-grey-500);
  }
  
  input {
    padding: 8px 8px 8px 36px;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    width: 200px;
    transition: all var(--transition-fast) ease;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      width: 250px;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.header-button {
  position: relative;
  background: none;
  border: none;
  color: var(--color-grey-700);
  font-size: 1.25rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-grey-200);
  }
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-grey-200);
  }
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-grey-800);
}

@media (max-width: 768px) {
  .search-box {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>