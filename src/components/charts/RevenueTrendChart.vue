<template>
  <div class="chart-container">
    <component :is="chartComponent" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  type: string,
  period: string,
  category: string
}>()

// Determine which chart component to use
const chartComponent = computed(() => {
  return props.type === 'line' ? Line : Bar
})

// Generate sample data based on props
const generateData = (period: string, category: string) => {
  // This would typically come from an API
  let labels = []
  let revenueData = []
  let ordersData = []
  
  // Generate appropriate labels based on time period
  switch (period) {
    case 'Daily':
      labels = ['May 1', 'May 2', 'May 3', 'May 4', 'May 5', 'May 6', 'May 7']
      break
    case 'Weekly':
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      break
    case 'Monthly':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      break
    case 'Quarterly':
      labels = ['Q1', 'Q2', 'Q3', 'Q4']
      break
    case 'Yearly':
      labels = ['2020', '2021', '2022', '2023', '2024', '2025']
      break
    default:
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  }
  
  // Generate random data with some logic to it
  const categoryMultiplier = category === 'electronics' ? 1.5 : 
                             category === 'clothing' ? 0.8 :
                             category === 'home' ? 1.2 :
                             category === 'beauty' ? 0.7 : 1.0
  
  for (let i = 0; i < labels.length; i++) {
    // Base value plus some randomness, modified by category if selected
    const baseValue = 10000 + (i * 1000) 
    const randomFactor = Math.random() * 3000 - 1500
    const categoryFactor = category === 'all' ? 1 : categoryMultiplier
    
    revenueData.push(Math.round((baseValue + randomFactor) * categoryFactor))
    ordersData.push(Math.round((baseValue + randomFactor) / 50))
  }
  
  return {
    labels,
    revenueData,
    ordersData
  }
}

// Get data based on current props
const data = computed(() => generateData(props.period, props.category))

// Chart data
const chartData = computed(() => ({
  labels: data.value.labels,
  datasets: [
    {
      label: 'Revenue ($)',
      backgroundColor: 'rgba(15, 82, 186, 0.7)',
      borderColor: 'rgba(15, 82, 186, 1)',
      borderWidth: 2,
      tension: 0.4,
      borderRadius: 4,
      data: data.value.revenueData,
      yAxisID: 'y'
    },
    {
      label: 'Orders',
      backgroundColor: 'rgba(32, 178, 170, 0.7)',
      borderColor: 'rgba(32, 178, 170, 1)',
      borderWidth: 2,
      tension: 0.4,
      borderRadius: 4,
      data: data.value.ordersData,
      yAxisID: 'y1'
    }
  ]
}))

// Chart options with dual y-axes
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      title: {
        display: true,
        text: 'Revenue ($)',
        color: 'rgba(15, 82, 186, 1)'
      },
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        callback: function(value: any) {
          return '$' + value.toLocaleString();
        }
      }
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      title: {
        display: true,
        text: 'Orders',
        color: 'rgba(32, 178, 170, 1)'
      },
      grid: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      cornerRadius: 4,
      boxPadding: 3,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.dataset.yAxisID === 'y') {
            label += '$' + context.raw.toLocaleString();
          } else {
            label += context.raw;
          }
          return label;
        }
      }
    }
  },
  animation: {
    duration: 500
  },
  interaction: {
    mode: 'index' as const,
    intersect: false
  }
}
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
}
</style>