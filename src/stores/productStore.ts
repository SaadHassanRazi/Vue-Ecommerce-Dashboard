import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export interface Product {
  id: number
  name: string
  sku: string
  category: string
  description: string
  price: number
  costPrice: number
  stock: number
  lowStockThreshold: number
  weight: number
  dimensions: string
  image: string
  attributes: { name: string; value: string }[]
  createdAt: string
  selected?: boolean
}

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/products')
      products.value = response.data.map((product: Product) => ({
        ...product,
        selected: false
      }))
    } catch (err: any) {
      console.error('Error fetching products:', err)
      error.value = err.response?.data?.message || 'Failed to fetch products'
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      
      // Add all product data to form data
      Object.entries(product).forEach(([key, value]) => {
        if (key === 'attributes') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'image' && value instanceof File) {
          formData.append('image', value)
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      })
      
      const response = await axios.post('/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Add the new product to the store
      products.value.push({
        ...response.data,
        selected: false
      })
      
      return response.data
    } catch (err: any) {
      console.error('Error adding product:', err)
      error.value = err.response?.data?.message || 'Failed to add product'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const formData = new FormData()
      
      // Add all update data to form data
      Object.entries(updates).forEach(([key, value]) => {
        if (key === 'attributes') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'image' && value instanceof File) {
          formData.append('image', value)
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      })
      
      const response = await axios.put(`/api/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Update the product in the store
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          ...response.data,
          selected: products.value[index].selected
        }
      }
      
      return response.data
    } catch (err: any) {
      console.error('Error updating product:', err)
      error.value = err.response?.data?.message || 'Failed to update product'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteProduct = async (id: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      await axios.delete(`/api/products/${id}`)
      
      // Remove the product from the store
      products.value = products.value.filter(p => p.id !== id)
      
      return true
    } catch (err: any) {
      console.error('Error deleting product:', err)
      error.value = err.response?.data?.message || 'Failed to delete product'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const getLowStockProducts = () => {
    return products.value.filter(p => p.stock <= p.lowStockThreshold)
  }

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts
  }
})