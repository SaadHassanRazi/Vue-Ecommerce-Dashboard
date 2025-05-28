<template>
  <div class="revenue-analysis">
    <div class="filters-bar">
      <div class="date-range">
        <label>Date Range:</label>
        <div class="date-picker">
          <button @click="showDatePicker = !showDatePicker">
            {{ formatDateRange(dateRange.start, dateRange.end) }}
            <i class="pi pi-calendar"></i>
          </button>
          <!-- Date picker would go here -->
        </div>
      </div>
      
      <div class="category-filter">
        <label>Category:</label>
        <select v-model="selectedCategory">
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home & Kitchen</option>
          <option value="beauty">Beauty & Personal Care</option>
        </select>
      </div>
      
      <div class="time-grouping">
        <label>Group By:</label>
        <div class="button-group">
          <button 
            v-for="period in timePeriods" 
            :key="period"
            :class="{ active: selectedTimePeriod === period }"
            @click="selectedTimePeriod = period">
            {{ period }}
          </button>
        </div>
      </div>
      
      <button class="export-btn">
        <i class="pi pi-download"></i>
        Export
      </button>
    </div>
    
    <div class="metrics-row">
      <div class="metric-card" v-for="(metric, index) in metrics" :key="index">
        <h3>{{ metric.title }}</h3>
        <div class="metric-value">{{ metric.value }}</div>
        <div class="metric-comparison" :class="{ 'positive': metric.change > 0, 'negative': metric.change < 0 }">
          <i :class="metric.change > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
          {{ Math.abs(metric.change) }}% vs previous period
        </div>
      </div>
    </div>
    
    <div class="main-chart-container">
      <div class="chart-header">
        <h3>Revenue Trends</h3>
        <div class="chart-controls">
          <button class="chart-type-btn" :class="{ active: chartType === 'line' }" @click="chartType = 'line'">
            <i class="pi pi-chart-line"></i>
          </button>
          <button class="chart-type-btn" :class="{ active: chartType === 'bar' }" @click="chartType = 'bar'">
            <i class="pi pi-chart-bar"></i>
          </button>
        </div>
      </div>
      <div class="chart-wrapper">
        <RevenueTrendChart :type="chartType" :period="selectedTimePeriod" :category="selectedCategory" />
      </div>
    </div>
    
    <div class="charts-grid">
      <div class="chart-card">
        <h3>Revenue by Category</h3>
        <CategoryRevenueChart />
      </div>
      
      <div class="chart-card">
        <h3>Revenue by Channel</h3>
        <ChannelRevenueChart />
      </div>
    </div>
    
    <div class="data-table-section">
      <div class="table-header">
        <h3>Revenue Details</h3>
        <div class="table-search">
          <i class="pi pi-search"></i>
          <input type="text" placeholder="Search data..." v-model="searchQuery" />
        </div>
      </div>
      
      <div class="revenue-table">
        <div class="ag-theme-alpine" style="height: 400px; width: 100%;">
          <!-- AG Grid would go here -->
          <div class="table-placeholder">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Orders</th>
                  <th>Revenue</th>
                  <th>Avg. Price</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in filteredTableData" :key="index">
                  <td>{{ row.date }}</td>
                  <td>{{ row.product }}</td>
                  <td>{{ row.category }}</td>
                  <td>{{ row.orders }}</td>
                  <td>${{ row.revenue.toLocaleString() }}</td>
                  <td>${{ row.avgPrice.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import RevenueTrendChart from '@/components/charts/RevenueTrendChart.vue'
import CategoryRevenueChart from '@/components/charts/CategoryRevenueChart.vue'
import ChannelRevenueChart from '@/components/charts/ChannelRevenueChart.vue'

// Filters
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)),
  end: new Date()
})
const showDatePicker = ref(false)
const selectedCategory = ref('all')
const selectedTimePeriod = ref('Weekly')
const timePeriods = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']
const chartType = ref('bar')
const searchQuery = ref('')

// Format date range for display
const formatDateRange = (start: Date, end: Date) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
  return `${formatDate(start)} - ${formatDate(end)}`
}

// Metrics data
const metrics = [
  {
    title: 'Total Revenue',
    value: '$128,450.67',
    change: 12.5
  },
  {
    title: 'Orders',
    value: '2,354',
    change: 5.2
  },
  {
    title: 'Avg. Order Value',
    value: '$54.57',
    change: 6.8
  },
  {
    title: 'Conversion Rate',
    value: '3.42%',
    change: -1.3
  }
]

// Table data
const tableData = [
  { date: 'May 1, 2025', product: 'iPhone 15 Pro', category: 'Electronics', orders: 28, revenue: 34720, avgPrice: 1240 },
  { date: 'May 1, 2025', product: 'Samsung S24', category: 'Electronics', orders: 32, revenue: 28800, avgPrice: 900 },
  { date: 'May 2, 2025', product: 'Nike Air Max', category: 'Clothing', orders: 45, revenue: 8100, avgPrice: 180 },
  { date: 'May 2, 2025', product: 'MacBook Pro', category: 'Electronics', orders: 12, revenue: 24000, avgPrice: 2000 },
  { date: 'May 3, 2025', product: 'AirPods Pro', category: 'Electronics', orders: 56, revenue: 13440, avgPrice: 240 },
  { date: 'May 3, 2025', product: 'Dyson Vacuum', category: 'Home & Kitchen', orders: 8, revenue: 4800, avgPrice: 600 },
  { date: 'May 4, 2025', product: 'Levi\'s Jeans', category: 'Clothing', orders: 64, revenue: 6400, avgPrice: 100 },
  { date: 'May 4, 2025', product: 'Sony Headphones', category: 'Electronics', orders: 23, revenue: 6900, avgPrice: 300 }
]

// Filter table data based on search query
const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData
  
  const query = searchQuery.value.toLowerCase()
  return tableData.filter(row => 
    row.product.toLowerCase().includes(query) ||
    row.category.toLowerCase().includes(query) ||
    row.date.toLowerCase().includes(query)
  )
})
</script>

<style scoped lang="scss">
.revenue-analysis {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-md);
  
  label {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-grey-700);
    margin-bottom: 4px;
    display: block;
  }
  
  select, button {
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-grey-300);
    font-size: var(--font-size-sm);
    background-color: white;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
  
  button {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    
    i {
      font-size: var(--font-size-sm);
    }
  }
}

.date-picker button {
  min-width: 200px;
  justify-content: space-between;
}

.button-group {
  display: flex;
  
  button {
    border-radius: 0;
    margin-right: -1px;
    
    &:first-child {
      border-top-left-radius: var(--radius-sm);
      border-bottom-left-radius: var(--radius-sm);
    }
    
    &:last-child {
      border-top-right-radius: var(--radius-sm);
      border-bottom-right-radius: var(--radius-sm);
      margin-right: 0;
    }
    
    &.active {
      background-color: var(--color-primary);
      color: white;
      border-color: var(--color-primary);
    }
  }
}

.export-btn {
  margin-left: auto;
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  
  &:hover {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
  }
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
}

.metric-card {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-md);
  
  h3 {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-grey-600);
    margin-bottom: 4px;
  }
  
  .metric-value {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: 4px;
  }
  
  .metric-comparison {
    font-size: var(--font-size-xs);
    display: flex;
    align-items: center;
    gap: 4px;
    
    &.positive {
      color: var(--color-success);
    }
    
    &.negative {
      color: var(--color-error);
    }
  }
}

.main-chart-container {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-md);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  
  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-grey-800);
  }
}

.chart-controls {
  display: flex;
  gap: 4px;
}

.chart-type-btn {
  background: none;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--radius-sm);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-grey-100);
  }
  
  &.active {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  
  i {
    font-size: var(--font-size-md);
  }
}

.chart-wrapper {
  height: 400px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-3);
}

.chart-card {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-md);
  height: 300px;
  
  h3 {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-grey-800);
    margin-bottom: var(--space-3);
  }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  
  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-grey-800);
  }
}

.table-search {
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
    width: 240px;
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}

.revenue-table {
  background-color: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

// Table placeholder styling (would be replaced by AG Grid)
.table-placeholder {
  width: 100%;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px 16px;
      text-align: left;
    }
    
    th {
      background-color: var(--color-grey-100);
      font-weight: 600;
      color: var(--color-grey-800);
      border-bottom: 1px solid var(--color-grey-300);
    }
    
    tr {
      border-bottom: 1px solid var(--color-grey-200);
      
      &:hover {
        background-color: var(--color-grey-100);
      }
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    
    > div {
      width: 100%;
    }
    
    .export-btn {
      margin-left: 0;
      width: 100%;
    }
  }
}
</style>