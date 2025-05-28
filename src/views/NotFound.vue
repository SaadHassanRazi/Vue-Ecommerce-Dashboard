<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, we couldn't find the page you were looking for.</p>
      <router-link to="/" class="back-btn">
        <i class="pi pi-home"></i>
        Back to Dashboard
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.not-found-content {
  text-align: center;
  max-width: 500px;
  
  h1 {
    font-size: 6rem;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: var(--space-2);
    line-height: 1;
  }
  
  h2 {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--color-grey-800);
    margin-bottom: var(--space-3);
  }
  
  p {
    font-size: var(--font-size-lg);
    color: var(--color-grey-600);
    margin-bottom: var(--space-4);
  }
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--transition-fast) ease;
  
  &:hover {
    background-color: var(--color-primary-dark);
    color: white;
  }
}
</style>