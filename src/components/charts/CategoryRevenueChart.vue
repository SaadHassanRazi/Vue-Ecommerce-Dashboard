<template>
  <div class="chart-container">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

// Sample data
const chartData = {
  labels: ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports', 'Books'],
  datasets: [
    {
      data: [56000, 28500, 18600, 12400, 8300, 4500],
      backgroundColor: [
        'rgba(15, 82, 186, 0.8)',   // Blue
        'rgba(32, 178, 170, 0.8)',  // Teal
        'rgba(255, 215, 0, 0.8)',   // Gold
        'rgba(76, 175, 80, 0.8)',   // Green
        'rgba(244, 67, 54, 0.8)',   // Red
        'rgba(156, 39, 176, 0.8)'   // Purple
      ],
      borderColor: [
        'rgba(15, 82, 186, 1)',
        'rgba(32, 178, 170, 1)',
        'rgba(255, 215, 0, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(156, 39, 176, 1)'
      ],
      borderWidth: 1
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
      position: 'right',
      align: 'center',
      labels: {
        boxWidth: 12,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: 11
        },
        padding: 15
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
          return `${label}: $${value.toLocaleString()} (${percentage}%)`;
        }
      }
    }
  },
  animation: {
    animateRotate: true,
    animateScale: true
  }
}
</script>

<style scoped lang="scss">
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>