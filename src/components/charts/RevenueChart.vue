<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  period: string
}>()

// Sample data for different time periods
const dayData = {
  labels: ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: 'rgba(15, 82, 186, 0.7)',
      borderColor: 'rgba(15, 82, 186, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [215, 170, 140, 350, 450, 380, 520, 480]
    },
    {
      label: 'Orders',
      backgroundColor: 'rgba(32, 178, 170, 0.7)',
      borderColor: 'rgba(32, 178, 170, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [12, 8, 6, 18, 24, 20, 28, 25]
    }
  ]
}

const weekData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: 'rgba(15, 82, 186, 0.7)',
      borderColor: 'rgba(15, 82, 186, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [1850, 2100, 1950, 2350, 2800, 3250, 2950]
    },
    {
      label: 'Orders',
      backgroundColor: 'rgba(32, 178, 170, 0.7)',
      borderColor: 'rgba(32, 178, 170, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [32, 38, 35, 42, 52, 62, 54]
    }
  ]
}

const monthData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: 'rgba(15, 82, 186, 0.7)',
      borderColor: 'rgba(15, 82, 186, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [9500, 11250, 12800, 14350]
    },
    {
      label: 'Orders',
      backgroundColor: 'rgba(32, 178, 170, 0.7)',
      borderColor: 'rgba(32, 178, 170, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [182, 205, 235, 254]
    }
  ]
}

const yearData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: 'rgba(15, 82, 186, 0.7)',
      borderColor: 'rgba(15, 82, 186, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [32000, 34500, 38700, 41200, 45800, 49300, 52100, 54800, 57900, 61200, 64500, 68000]
    },
    {
      label: 'Orders',
      backgroundColor: 'rgba(32, 178, 170, 0.7)',
      borderColor: 'rgba(32, 178, 170, 1)',
      borderWidth: 1,
      borderRadius: 4,
      data: [580, 630, 710, 760, 830, 900, 950, 1000, 1050, 1120, 1180, 1250]
    }
  ]
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
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
      position: 'top',
      align: 'end',
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
      boxPadding: 3
    }
  },
  animation: {
    duration: 500
  }
}

// Select data based on period
const chartData = computed(() => {
  switch (props.period) {
    case 'Day':
      return dayData
    case 'Week':
      return weekData
    case 'Month':
      return monthData
    case 'Year':
      return yearData
    default:
      return weekData
  }
})
</script>

<style scoped lang="scss">
.chart-container {
  flex: 1;
  position: relative;
}
</style>