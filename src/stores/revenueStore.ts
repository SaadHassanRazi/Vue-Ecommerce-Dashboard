import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface RevenueSummary {
  totalSales: number
  totalOrders: number
  avgOrderValue: number
  lastUpdated: string
}

export interface RevenueByCategory {
  category: string
  revenue: number
}

export interface RevenueByDate {
  date?: string
  week?: string
  month?: string
  revenue: number
  orders: number
}

export interface Sale {
  id: number
  date: string
  productId: number
  quantity: number
  price: number
  amount: number
  channel: string
  status: string
  customerId: number
}

export const useRevenueStore = defineStore('revenue', () => {
  const summary = ref<RevenueSummary | null>(null)
  const byCategory = ref<RevenueByCategory[]>([])
  const byDate = ref<RevenueByDate[]>([])
  const sales = ref<Sale[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchSummary = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/revenue/summary')
      summary.value = response.data
    } catch (err: any) {
      console.error('Error fetching revenue summary:', err)
      error.value = err.response?.data?.message || 'Failed to fetch revenue summary'
    } finally {
      isLoading.value = false
    }
  }

  const fetchRevenueByCategory = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/revenue/by-category')
      byCategory.value = response.data
    } catch (err: any) {
      console.error('Error fetching revenue by category:', err)
      error.value = err.response?.data?.message || 'Failed to fetch revenue by category'
    } finally {
      isLoading.value = false
    }
  }

  const fetchRevenueByDate = async (period: string = 'daily') => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get(`/api/revenue/by-date?period=${period}`)
      byDate.value = response.data
    } catch (err: any) {
      console.error('Error fetching revenue by date:', err)
      error.value = err.response?.data?.message || 'Failed to fetch revenue by date'
    } finally {
      isLoading.value = false
    }
  }

  const fetchSales = async (startDate?: string, endDate?: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      let url = '/api/sales'
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`
      }
      
      const response = await axios.get(url)
      sales.value = response.data
    } catch (err: any) {
      console.error('Error fetching sales:', err)
      error.value = err.response?.data?.message || 'Failed to fetch sales'
    } finally {
      isLoading.value = false
    }
  }

  return {
    summary,
    byCategory,
    byDate,
    sales,
    isLoading,
    error,
    fetchSummary,
    fetchRevenueByCategory,
    fetchRevenueByDate,
    fetchSales
  }
})