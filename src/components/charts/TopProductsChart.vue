<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  filter: string
}>()

// Sample data
const productsByRevenue = {
  labels: ['iPhone 15 Pro', 'Samsung S24', 'MacBook Pro', 'AirPods Pro', 'Others'],
  datasets: [
    {
      backgroundColor: [
        'rgba(15, 82, 186, 0.8)',
        'rgba(32, 178, 170, 0.8)',
        'rgba(255, 215, 0, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(173, 181, 189, 0.8)'
      ],
      borderColor: [
        'rgba(15, 82, 186, 1)',
        'rgba(32, 178, 170, 1)',
        'rgba(255, 215, 0, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(173, 181, 189, 1)'
      ],
      borderWidth: 1,
      data: [28500, 21400, 18600, 14250, 22800]
    }
  ]
}

const productsByUnits = {
  labels: ['iPhone 15 Pro', 'Samsung S24', 'MacBook Pro', 'AirPods Pro', 'Others'],
  datasets: [
    {
      backgroundColor: [
        'rgba(15, 82, 186, 0.8)',
        'rgba(32, 178, 170, 0.8)',
        'rgba(255, 215, 0, 0.8)',
        'rgba(76, 175, 80, 0.8)',
        'rgba(173, 181, 189, 0.8)'
      ],
      borderColor: [
        'rgba(15, 82, 186, 1)',
        'rgba(32, 178, 170, 1)',
        'rgba(255, 215, 0, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(173, 181, 189, 1)'
      ],
      borderWidth: 1,
      data: [120, 145, 35, 210, 280]
    }
  ]
}

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 10,
      cornerRadius: 4,
      boxPadding: 3,
      callbacks: {
        label: function(context: any) {
          const label = context.label || '';
          const value = context.raw;
          const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${props.filter === 'revenue' ? '$' + value.toLocaleString() : value} (${percentage}%)`;
        }
      }
    }
  },
  cutout: '60%',
  animation: {
    animateRotate: true,
    animateScale: true
  }
}

// Select data based on filter
const chartData = computed(() => {
  return props.filter === 'revenue' ? productsByRevenue : productsByUnits
})
</script>

<style scoped lang="scss">
.chart-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>