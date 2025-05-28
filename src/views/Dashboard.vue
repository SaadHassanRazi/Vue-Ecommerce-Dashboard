<template>
  <div class="dashboard">
    <div class="metrics-grid">
      <div class="metric-card" v-for="metric in metrics" :key="metric.title">
        <div class="metric-icon" :class="metric.colorClass">
          <i :class="metric.icon"></i>
        </div>
        <div class="metric-content">
          <h3 class="metric-title">{{ metric.title }}</h3>
          <p class="metric-value">{{ metric.value }}</p>
          <div class="metric-trend" :class="metric.trendClass">
            <i :class="metric.trendIcon"></i> {{ metric.trendValue }}
          </div>
        </div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Revenue Overview</h3>
          <div class="chart-actions">
            <button
              v-for="period in periods"
              :key="period"
              :class="{ active: selectedPeriod === period }"
              @click="selectedPeriod = period"
              class="chart-period-btn"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <RevenueChart :period="selectedPeriod" />
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <h3>Top Products</h3>
          <select v-model="topProductsFilter">
            <option value="revenue">By Revenue</option>
            <option value="units">By Units Sold</option>
          </select>
        </div>
        <TopProductsChart :filter="topProductsFilter" />
      </div>
    </div>

    <div class="inventory-alert-section">
      <h3 class="section-title">Inventory Alerts</h3>
      <div class="alert-cards">
        <div
          v-for="alert in inventoryAlerts"
          :key="alert.id"
          class="alert-card"
        >
          <div class="alert-image">
            <img
              :src="
                alert.image
                  ? `http://localhost:3000${alert.image}`
                  : 'https://via.placeholder.com/100'
              "
              :alt="alert.name"
            />
            <div class="alert-badge" :class="alert.severity">
              {{ alert.stock }} left
            </div>
          </div>
          <div class="alert-content">
            <h4>{{ alert.name }}</h4>
            <p class="alert-category">{{ alert.category }}</p>
            <p class="alert-message" :class="alert.severity">
              <i class="pi pi-exclamation-triangle"></i> {{ alert.message }}
            </p>
          </div>
          <button class="restock-btn" @click="restockItem(alert)">
            Restock
          </button>
        </div>
      </div>
      <div class="error-message" v-if="apiError">
        <i class="pi pi-exclamation-triangle"></i> {{ apiError }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import RevenueChart from "@/components/charts/RevenueChart.vue";
import TopProductsChart from "@/components/charts/TopProductsChart.vue";

const revenueSummary = ref<any>({});
const inventoryAlerts = ref<any[]>([]);
const selectedPeriod = ref("Week");
const periods = ["Day", "Week", "Month", "Year"];
const topProductsFilter = ref("revenue");
const apiError = ref("");

// Fetch data
const fetchData = async () => {
  try {
    const [summaryRes, alertsRes] = await Promise.all([
      axios.get("http://localhost:3000/api/revenue/summary"),
      axios.get("http://localhost:3000/api/inventory/low-stock"),
    ]);
    revenueSummary.value = summaryRes.data;
    inventoryAlerts.value = alertsRes.data;
    apiError.value = "";
  } catch (error) {
    apiError.value = "Failed to load dashboard data";
  }
};

onMounted(fetchData);

// Metrics
const metrics = computed(() => [
  {
    title: "Total Sales",
    value: revenueSummary.value.totalSales
      ? `$${revenueSummary.value.totalSales.toLocaleString()}`
      : "$0",
    icon: "pi pi-dollar",
    colorClass: "green",
    trendClass: "up",
    trendIcon: "pi pi-arrow-up",
    trendValue: "12% vs last month",
  },
  {
    title: "Total Orders",
    value: revenueSummary.value.totalOrders || "0",
    icon: "pi pi-shopping-cart",
    colorClass: "blue",
    trendClass: "up",
    trendIcon: "pi pi-arrow-up",
    trendValue: "8% vs last month",
  },
  {
    title: "Avg Order Value",
    value: revenueSummary.value.avgOrderValue
      ? `$${revenueSummary.value.avgOrderValue.toFixed(2)}`
      : "$0",
    icon: "pi pi-chart-line",
    colorClass: "orange",
    trendClass: "down",
    trendIcon: "pi pi-arrow-down",
    trendValue: "5% vs last month",
  },
  {
    title: "Low Stock Items",
    value: inventoryAlerts.value.length || "0",
    icon: "pi pi-exclamation-triangle",
    colorClass: "red",
    trendClass: "up",
    trendIcon: "pi pi-arrow-up",
    trendValue: "3 new alerts",
  },
]);

// Restock
const restockItem = async (alert: any) => {
  try {
    await axios.put(`http://localhost:3000/api/products/${alert.id}`, {
      stock: alert.stock + 10,
    });
    await fetchData();
    apiError.value = "";
  } catch (error) {
    apiError.value = "Failed to restock item";
  }
};
</script>

<style scoped lang="scss">
:root {
  --color-primary: #0f52ba;
  --color-primary-dark: #0c4294;
  --color-error: #f44336;
  --color-success: #4caf50;
  --color-warning: #ff9800;
  --color-grey-100: #f5f5f5;
  --color-grey-200: #eeeeee;
  --color-grey-300: #e0e0e0;
  --color-grey-600: #757575;
  --color-grey-800: #424242;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --radius-md: 8px;
  --radius-sm: 4px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --shadow-md: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard {
  padding: var(--space-4);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-3);
}

.metric-card {
  background: white;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.metric-icon.blue {
  background: var(--color-primary);
}
.metric-icon.green {
  background: var(--color-success);
}
.metric-icon.orange {
  background: var(--color-warning);
}
.metric-icon.red {
  background: var(--color-error);
}

.metric-title {
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
}

.metric-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-grey-800);
  margin: var(--space-1) 0;
}

.metric-trend {
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.metric-trend.up {
  color: var(--color-success);
}
.metric-trend.down {
  color: var(--color-error);
}

.chart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  margin: var(--space-4) 0;
}

@media (max-width: 768px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: white;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.chart-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.chart-actions {
  display: flex;
  gap: var(--space-1);
}

.chart-period-btn {
  padding: 8px 16px;
  border: 1px solid var(--color-grey-300);
  background: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.chart-period-btn.active,
.chart-period-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.chart-header select {
  padding: 8px;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--radius-md);
}

.chart-header select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.inventory-alert-section {
  margin-top: var(--space-4);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-3);
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-3);
}

.alert-card {
  background: white;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.alert-image {
  position: relative;
  width: 100px;
}

.alert-image img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.alert-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: white;
}

.alert-badge.critical {
  background: var(--color-error);
}
.alert-badge.warning {
  background: var(--color-warning);
}
.alert-badge.info {
  background: var(--color-primary);
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  font-size: var(--font-size-md);
  font-weight: 600;
}

.alert-category {
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
}

.alert-message {
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.alert-message.critical {
  color: var(--color-error);
}
.alert-message.warning {
  color: var(--color-warning);
}
.alert-message.info {
  color: var(--color-primary);
}

.restock-btn {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.restock-btn:hover {
  background: var(--color-primary-dark);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-xs);
  margin-top: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}
</style>
