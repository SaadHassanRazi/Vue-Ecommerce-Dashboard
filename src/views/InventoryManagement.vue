<template>
  <div class="inventory-management">
    <div class="filters-bar">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <input
          type="text"
          placeholder="Search products..."
          v-model="searchQuery"
        />
      </div>

      <div class="filter-group">
        <select v-model="categoryFilter">
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Beauty">Beauty & Personal Care</option>
        </select>

        <select v-model="stockFilter">
          <option value="all">All Stock Levels</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="in">In Stock</option>
        </select>
      </div>

      <div class="action-buttons">
        <button class="secondary-btn">
          <i class="pi pi-filter"></i>
          More Filters
        </button>

        <router-link to="/products/add" class="primary-btn">
          <i class="pi pi-plus"></i>
          Add Product
        </router-link>
      </div>
    </div>

    <div class="inventory-stats">
      <div class="stat-card">
        <i class="pi pi-box stat-icon blue"></i>
        <div class="stat-content">
          <span class="stat-value">{{ totalProducts }}</span>
          <span class="stat-label">Total Products</span>
        </div>
      </div>

      <div class="stat-card">
        <i class="pi pi-exclamation-triangle stat-icon orange"></i>
        <div class="stat-content">
          <span class="stat-value">{{ lowStockCount }}</span>
          <span class="stat-label">Low Stock Items</span>
        </div>
      </div>

      <div class="stat-card">
        <i class="pi pi-times-circle stat-icon red"></i>
        <div class="stat-content">
          <span class="stat-value">{{ outOfStockCount }}</span>
          <span class="stat-label">Out of Stock</span>
        </div>
      </div>

      <div class="stat-card">
        <i class="pi pi-dollar stat-icon green"></i>
        <div class="stat-content">
          <span class="stat-value"
            >${{ totalInventoryValue.toLocaleString() }}</span
          >
          <span class="stat-label">Inventory Value</span>
        </div>
      </div>
    </div>

    <div class="inventory-table">
      <div class="table-header">
        <h3>Inventory List</h3>
        <div class="table-actions">
          <button class="icon-btn" title="Export Data">
            <i class="pi pi-download"></i>
          </button>
          <button class="icon-btn" title="Print">
            <i class="pi pi-print"></i>
          </button>
          <button class="icon-btn" title="Refresh" @click="fetchProducts">
            <i class="pi pi-refresh"></i>
          </button>
        </div>
      </div>

      <div class="ag-theme-alpine" style="height: 500px; width: 100%">
        <table class="inventory-data-table">
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="allSelected"
                />
              </th>
              <th class="image-cell">Image</th>
              <th @click="sortBy('name')" class="sortable">
                Product Name
                <i class="pi" :class="getSortIconClass('name')"></i>
              </th>
              <th @click="sortBy('sku')" class="sortable">
                SKU
                <i class="pi" :class="getSortIconClass('sku')"></i>
              </th>
              <th @click="sortBy('category')" class="sortable">
                Category
                <i class="pi" :class="getSortIconClass('category')"></i>
              </th>
              <th @click="sortBy('price')" class="sortable">
                Price
                <i class="pi" :class="getSortIconClass('price')"></i>
              </th>
              <th @click="sortBy('stock')" class="sortable">
                Stock
                <i class="pi" :class="getSortIconClass('stock')"></i>
              </th>
              <th>Status</th>
              <th class="actions-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in filteredProducts" :key="product.id">
              <td class="checkbox-cell">
                <input type="checkbox" v-model="product.selected" />
              </td>
              <td class="image-cell">
                <img
                  :src="product.image || 'https://via.placeholder.com/50'"
                  :alt="product.name"
                  class="product-thumbnail"
                />
              </td>
              <td>{{ product.name }}</td>
              <td>{{ product.sku }}</td>
              <td>{{ product.category }}</td>
              <td>${{ product.price.toFixed(2) }}</td>
              <td>
                <div class="stock-edit">
                  <input
                    type="number"
                    v-model.number="product.stock"
                    min="0"
                    @change="updateStock(product)"
                  />
                </div>
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="
                    getStockStatusClass(
                      product.stock,
                      product.lowStockThreshold
                    )
                  "
                >
                  {{ getStockStatus(product.stock, product.lowStockThreshold) }}
                </span>
              </td>
              <td class="actions-cell">
                <router-link
                  :to="`/products/edit/${product.id}`"
                  class="action-btn"
                  title="Edit Product"
                >
                  <i class="pi pi-pencil"></i>
                </router-link>
                <button
                  class="action-btn delete"
                  title="Delete"
                  @click="deleteProduct(product.id)"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bulk-actions">
        <div class="selected-count">{{ selectedCount }} items selected</div>
        <div class="bulk-buttons">
          <button
            class="secondary-btn"
            :disabled="selectedCount === 0"
            @click="bulkUpdate"
          >
            Bulk Update
          </button>
          <button
            class="danger-btn"
            :disabled="selectedCount === 0"
            @click="bulkDelete"
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div class="error-message" v-if="apiError">
        <i class="pi pi-exclamation-triangle"></i>
        {{ apiError }}
      </div>
    </div>

    <div class="inventory-insights">
      <div class="insight-card">
        <h3>Low Stock Items</h3>
        <div class="low-stock-list">
          <div
            class="low-stock-item"
            v-for="product in lowStockItems"
            :key="product.id"
          >
            <img
              :src="product.image || 'https://via.placeholder.com/50'"
              :alt="product.name"
              class="product-thumbnail"
            />
            <div class="low-stock-info">
              <h4>{{ product.name }}</h4>
              <p>
                <span class="stock-label">Current Stock:</span>
                <span
                  class="stock-value"
                  :class="{ 'text-danger': product.stock === 0 }"
                >
                  {{ product.stock }}
                </span>
                <span class="stock-separator">|</span>
                <span class="stock-label">Threshold:</span>
                <span class="stock-value">{{ product.lowStockThreshold }}</span>
              </p>
            </div>
            <button
              class="restock-btn"
              @click="updateStock(product, product.lowStockThreshold + 10)"
            >
              Restock
            </button>
          </div>
        </div>
      </div>

      <div class="insight-card">
        <h3>Inventory Forecast</h3>
        <div class="forecast-chart">
          <div class="chart-placeholder">
            <p>Inventory forecast chart would go here</p>
            <p class="forecast-note">
              Based on current sales trends, you may run out of the following
              items soon:
            </p>
            <ul class="forecast-list">
              <li v-for="item in lowStockItems" :key="item.id">
                {{ item.name }} -
                <span
                  :class="{
                    'text-danger': item.stock === 0,
                    'text-warning': item.stock > 0,
                  }"
                >
                  {{
                    item.stock === 0
                      ? "Out of Stock"
                      : `${Math.ceil(item.lowStockThreshold / item.stock)} days`
                  }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// Filters
const searchQuery = ref("");
const categoryFilter = ref("all");
const stockFilter = ref("all");
const sortField = ref("name");
const sortDirection = ref("asc");
const apiError = ref("");

// Product data
const products = ref([]);

// Fetch products
const fetchProducts = async () => {
  try {
    console.log("Fetching products from: /api/products");
    const response = await axios.get("http://localhost:3000/api/products");
    products.value = response.data.map((p) => ({ ...p, selected: false }));
  } catch (error) {
    apiError.value = "Error fetching products";
    console.error(error);
  }
};

onMounted(fetchProducts);

// Computed properties
const filteredProducts = computed(() => {
  let result = [...products.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }

  if (categoryFilter.value !== "all") {
    result = result.filter(
      (product) =>
        product.category.toLowerCase() === categoryFilter.value.toLowerCase()
    );
  }

  if (stockFilter.value !== "all") {
    if (stockFilter.value === "low") {
      result = result.filter(
        (product) =>
          product.stock <= product.lowStockThreshold && product.stock > 0
      );
    } else if (stockFilter.value === "out") {
      result = result.filter((product) => product.stock === 0);
    } else if (stockFilter.value === "in") {
      result = result.filter(
        (product) => product.stock > product.lowStockThreshold
      );
    }
  }

  result.sort((a, b) => {
    let aValue = a[sortField.value];
    let bValue = b[sortField.value];

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection.value === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return result;
});

// Sorting
const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

const getSortIconClass = (field: string) => {
  if (sortField.value !== field) return "pi-sort";
  return sortDirection.value === "asc" ? "pi-sort-up" : "pi-sort-down";
};

// Stock status helpers
const getStockStatus = (stock: number, threshold: number) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= threshold) return "Low Stock";
  return "In Stock";
};

const getStockStatusClass = (stock: number, threshold: number) => {
  if (stock === 0) return "out-of-stock";
  if (stock <= threshold) return "low-stock";
  return "in-stock";
};

// Selection
const allSelected = computed(() => {
  return (
    filteredProducts.value.length > 0 &&
    filteredProducts.value.every((p) => p.selected)
  );
});

const selectedCount = computed(() => {
  return products.value.filter((p) => p.selected).length;
});

const toggleSelectAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  filteredProducts.value.forEach((p) => (p.selected = checked));
};

// Statistics
const totalProducts = computed(() => products.value.length);

const lowStockCount = computed(
  () =>
    products.value.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0)
      .length
);

const outOfStockCount = computed(
  () => products.value.filter((p) => p.stock === 0).length
);

const totalInventoryValue = computed(() =>
  products.value.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  )
);

const lowStockItems = computed(() =>
  products.value
    .filter((p) => p.stock <= p.lowStockThreshold)
    .sort(
      (a, b) => a.stock / a.lowStockThreshold - b.stock / b.lowStockThreshold
    )
);

// API interactions
const updateStock = async (product: any, newStock?: number) => {
  try {
    const stockValue = newStock !== undefined ? newStock : product.stock;
    await axios.put(`/api/products/${product.id}`, { stock: stockValue });
    await fetchProducts();
  } catch (error) {
    apiError.value = "Error updating stock";
    console.error(error);
  }
};

const deleteProduct = async (id: number) => {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await axios.delete(`/api/products/${id}`);
      await fetchProducts();
    } catch (error) {
      apiError.value = "Error deleting product";
      console.error(error);
    }
  }
};

const bulkUpdate = async () => {
  try {
    const selectedProducts = products.value.filter((p) => p.selected);
    for (const product of selectedProducts) {
      await axios.put(`/api/products/${product.id}`, { stock: product.stock });
    }
    await fetchProducts();
  } catch (error) {
    apiError.value = "Error performing bulk update";
    console.error(error);
  }
};

const bulkDelete = async () => {
  if (confirm("Are you sure you want to delete selected products?")) {
    try {
      const selectedProducts = products.value.filter((p) => p.selected);
      for (const product of selectedProducts) {
        await axios.delete(`/api/products/${product.id}`);
      }
      await fetchProducts();
    } catch (error) {
      apiError.value = "Error performing bulk delete";
      console.error(error);
    }
  }
};
</script>

<style scoped lang="scss">
/* Same styles as original */
.inventory-management {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-md);
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;

  i {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-grey-500);
  }

  input {
    padding: 10px 10px 10px 40px;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    width: 100%;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}

.filter-group {
  display: flex;
  gap: var(--space-2);

  select {
    padding: 10px;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    background-color: white;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}

.action-buttons {
  display: flex;
  gap: var(--space-2);
}

.secondary-btn,
.primary-btn,
.danger-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.secondary-btn {
  background-color: white;
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-300);

  &:hover {
    background-color: var(--color-grey-100);
    border-color: var(--color-grey-400);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.primary-btn {
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  text-decoration: none;

  &:hover {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
  }
}

.danger-btn {
  background-color: var(--color-error);
  color: white;
  border: 1px solid var(--color-error);

  &:hover {
    background-color: var(--color-error-dark);
    border-color: var(--color-error-dark);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.inventory-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
}

.stat-card {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;

  &.blue {
    background-color: var(--color-primary);
  }

  &.orange {
    background-color: var(--color-warning);
  }

  &.red {
    background-color: var(--color-error);
  }

  &.green {
    background-color: var(--color-success);
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-grey-900);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
}

.inventory-table {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-md);
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

.table-actions {
  display: flex;
  gap: var(--space-1);
}

.icon-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--radius-md);
  color: var(--color-grey-700);
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  &:hover {
    background-color: var(--color-grey-100);
    border-color: var(--color-grey-400);
  }
}

.inventory-data-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid var(--color-grey-200);
  }

  th {
    background-color: var(--color-grey-100);
    font-weight: 600;
    color: var(--color-grey-700);

    &.sortable {
      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: var(--color-grey-200);
      }
    }
  }

  tr:hover {
    background-color: var(--color-grey-100);
  }
}

.checkbox-cell {
  width: 40px;
  text-align: center;
}

.image-cell {
  width: 80px;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.stock-edit {
  display: flex;
  align-items: center;

  input {
    width: 80px;
    padding: 6px;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-sm);
    text-align: center;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }
  }
}

.status-badge {
  display: inline-flex;
  padding: 4px 8px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);

  &.in-stock {
    background-color: rgba(76, 175, 80, 0.1);
    color: var(--color-success);
  }

  &.low-stock {
    background-color: rgba(255, 193, 7, 0.1);
    color: var(--color-warning);
  }

  &.out-of-stock {
    background-color: rgba(244, 67, 54, 0.1);
    color: var(--color-error);
  }
}

.actions-cell {
  width: 120px;
  white-space: nowrap;
}

.action-btn {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-grey-700);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  &:hover {
    background-color: var(--color-grey-200);
  }

  &.delete:hover {
    background-color: rgba(244, 67, 54, 0.1);
    color: var(--color-error);
  }
}

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-3);
  margin-top: var(--space-3);
  border-top: 1px solid var(--color-grey-200);
}

.selected-count {
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
}

.bulk-buttons {
  display: flex;
  gap: var(--space-2);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--space-2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.inventory-insights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.insight-card {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-3);
  box-shadow: var(--shadow-md);

  h3 {
    font-size: var(--font-size-md);
    font-weight: 600;
    color: var(--color-grey-800);
    margin-bottom: var(--space-3);
  }
}

.low-stock-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.low-stock-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  transition: background-color var(--transition-fast) ease;

  &:hover {
    background-color: var(--color-grey-100);
  }
}

.low-stock-info {
  flex: 1;

  h4 {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--color-grey-800);
    margin-bottom: 4px;
  }

  p {
    font-size: var(--font-size-xs);
    color: var(--color-grey-600);
  }
}

.stock-label {
  color: var(--color-grey-600);
}

.stock-value {
  font-weight: 600;
  color: var(--color-grey-800);

  &.text-danger {
    color: var(--color-error);
  }
}

.stock-separator {
  margin: 0 6px;
  color: var(--color-grey-400);
}

.restock-btn {
  padding: 6px 12px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  &:hover {
    background-color: var(--color-primary-dark);
  }
}

.forecast-chart {
  height: 220px;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-grey-600);
}

.forecast-note {
  margin-top: var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-grey-700);
}

.forecast-list {
  list-style: none;
  padding: 0;
  margin-top: var(--space-2);

  li {
    font-size: var(--font-size-sm);
    margin-bottom: 4px;

    .text-danger {
      color: var(--color-error);
      font-weight: 600;
    }

    .text-warning {
      color: var(--color-warning);
      font-weight: 600;
    }
  }
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;

    .search-box,
    .filter-group,
    .action-buttons {
      width: 100%;
    }

    .filter-group {
      flex-direction: column;
    }
  }
}
</style>
