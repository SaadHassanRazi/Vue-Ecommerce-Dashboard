<template>
  <div class="add-product">
    <div class="form-header">
      <h2>{{ isEditMode ? "Edit Product" : "Add New Product" }}</h2>
      <p class="form-description">
        {{
          isEditMode
            ? "Update the product details below."
            : "Complete the form below to add a new product to your inventory."
        }}
      </p>
    </div>

    <form @submit.prevent="submitForm" class="product-form">
      <div class="form-grid">
        <div class="form-section">
          <h3 class="section-title">Basic Information</h3>

          <div class="form-group">
            <label for="name"
              >Product Name <span class="required">*</span></label
            >
            <input
              type="text"
              id="name"
              v-model="product.name"
              placeholder="Enter product name"
              required
              :class="{ error: validationErrors.name }"
            />
            <div v-if="validationErrors.name" class="error-message">
              {{ validationErrors.name }}
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="sku">SKU <span class="required">*</span></label>
              <input
                type="text"
                id="sku"
                v-model="product.sku"
                placeholder="e.g. IP15-256-BLK"
                required
                :class="{ error: validationErrors.sku }"
              />
              <div v-if="validationErrors.sku" class="error-message">
                {{ validationErrors.sku }}
              </div>
            </div>

            <div class="form-group">
              <label for="category"
                >Category <span class="required">*</span></label
              >
              <select
                id="category"
                v-model="product.category"
                required
                :class="{ error: validationErrors.category }"
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty">Beauty & Personal Care</option>
                <option value="Sports">Sports & Outdoors</option>
                <option value="Books">Books</option>
              </select>
              <div v-if="validationErrors.category" class="error-message">
                {{ validationErrors.category }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="product.description"
              placeholder="Enter product description"
              rows="4"
            ></textarea>
          </div>
        </div>

        <div class="form-section">
          <h3 class="section-title">Pricing & Inventory</h3>

          <div class="form-row">
            <div class="form-group">
              <label for="price"
                >Price ($) <span class="required">*</span></label
              >
              <input
                type="number"
                id="price"
                v-model="product.price"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                :class="{ error: validationErrors.price }"
              />
              <div v-if="validationErrors.price" class="error-message">
                {{ validationErrors.price }}
              </div>
            </div>

            <div class="form-group">
              <label for="costPrice">Cost Price ($)</label>
              <input
                type="number"
                id="costPrice"
                v-model="product.costPrice"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="stock"
                >Initial Stock <span class="required">*</span></label
              >
              <input
                type="number"
                id="stock"
                v-model="product.stock"
                placeholder="0"
                min="0"
                required
                :class="{ error: validationErrors.stock }"
              />
              <div v-if="validationErrors.stock" class="error-message">
                {{ validationErrors.stock }}
              </div>
            </div>

            <div class="form-group">
              <label for="lowStockThreshold">Low Stock Threshold</label>
              <input
                type="number"
                id="lowStockThreshold"
                v-model="product.lowStockThreshold"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                v-model="product.weight"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div class="form-group">
              <label for="dimensions">Dimensions (cm)</label>
              <input
                type="text"
                id="dimensions"
                v-model="product.dimensions"
                placeholder="L x W x H"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-section images-section">
        <h3 class="section-title">Product Images</h3>

        <div class="image-upload-container">
          <div class="image-preview" v-if="imagePreview || product.image">
            <img :src="imagePreview || product.image" alt="Product preview" />
            <button type="button" class="remove-image-btn" @click="removeImage">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div
            class="image-upload-area"
            v-if="!imagePreview && !product.image"
            @click="triggerFileInput"
          >
            <i class="pi pi-cloud-upload"></i>
            <p>Click to upload product image</p>
            <span>or drag and drop</span>
            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              accept="image/*"
              class="hidden-file-input"
            />
          </div>

          <div class="image-upload-help">
            <p>Recommended: 800x800px, max 5MB</p>
            <p>Formats: JPG, PNG, WEBP</p>
          </div>
        </div>
      </div>

      <div class="form-section attributes-section">
        <h3 class="section-title">Additional Attributes</h3>

        <div class="attributes-container">
          <div class="attributes-list">
            <div
              v-for="(attribute, index) in product.attributes"
              :key="index"
              class="attribute-item"
            >
              <div class="attribute-inputs">
                <input
                  type="text"
                  v-model="attribute.name"
                  placeholder="Attribute name"
                  class="attribute-name"
                />
                <input
                  type="text"
                  v-model="attribute.value"
                  placeholder="Attribute value"
                  class="attribute-value"
                />
              </div>
              <button
                type="button"
                class="remove-attribute-btn"
                @click="removeAttribute(index)"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <button
              type="button"
              class="add-attribute-btn"
              @click="addAttribute"
            >
              <i class="pi pi-plus"></i>
              Add Attribute
            </button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="cancelForm">
          Cancel
        </button>
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <i class="pi pi-spin pi-spinner" v-if="isSubmitting"></i>
          <span v-else>{{
            isEditMode ? "Update Product" : "Add Product"
          }}</span>
        </button>
      </div>

      <div class="error-message" v-if="apiError">
        <i class="pi pi-exclamation-triangle"></i>
        {{ apiError }}
      </div>
    </form>

    <div class="success-message" v-if="showSuccess">
      <div class="success-content">
        <i class="pi pi-check-circle"></i>
        <h3>
          {{
            isEditMode
              ? "Product Updated Successfully!"
              : "Product Added Successfully!"
          }}
        </h3>
        <p>
          The product has been
          {{ isEditMode ? "updated" : "added to your inventory" }}.
        </p>
        <div class="success-actions">
          <button @click="addAnother" class="secondary-btn">
            {{ isEditMode ? "Edit Another Product" : "Add Another Product" }}
          </button>
          <button @click="viewInventory" class="primary-btn">
            View Inventory
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const router = useRouter();
const route = useRoute();

// Determine if in edit mode
const isEditMode = computed(() => !!route.params.id);

// Form state
const product = reactive({
  id: null as number | null,
  name: "",
  sku: "",
  category: "",
  description: "",
  price: null as number | null,
  costPrice: null as number | null,
  stock: null as number | null,
  lowStockThreshold: 10,
  weight: null as number | null,
  dimensions: "",
  image: "",
  attributes: [] as { name: string; value: string }[],
});

const validationErrors = reactive({
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
});

const imagePreview = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);
const showSuccess = ref(false);
const apiError = ref("");

// Load product data if in edit mode
onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/${route.params.id}`
      );
      Object.assign(product, response.data);
      if (response.data.image) {
        imagePreview.value = response.data.image;
      }
    } catch (error) {
      apiError.value = "Error loading product data";
      console.error(error);
    }
  }
});

// Image handling
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target) {
        imagePreview.value = e.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  imagePreview.value = "";
  product.image = "";
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Attributes management
const addAttribute = () => {
  product.attributes.push({ name: "", value: "" });
};

const removeAttribute = (index: number) => {
  product.attributes.splice(index, 1);
};

// Form validation
const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(validationErrors).forEach((key) => {
    validationErrors[key as keyof typeof validationErrors] = "";
  });

  if (!product.name) {
    validationErrors.name = "Product name is required";
    isValid = false;
  }

  if (!product.sku) {
    validationErrors.sku = "SKU is required";
    isValid = false;
  }

  if (!product.category) {
    validationErrors.category = "Category is required";
    isValid = false;
  }

  if (product.price === null || product.price <= 0) {
    validationErrors.price = "Valid price is required";
    isValid = false;
  }

  if (product.stock === null || product.stock < 0) {
    validationErrors.stock = "Valid stock quantity is required";
    isValid = false;
  }

  return isValid;
};

// Form submission
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;
  apiError.value = "";

  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("sku", product.sku);
    formData.append("category", product.category);
    if (product.description)
      formData.append("description", product.description);
    formData.append("price", product.price!.toString());
    if (product.costPrice)
      formData.append("costPrice", product.costPrice.toString());
    formData.append("stock", product.stock!.toString());
    formData.append("lowStockThreshold", product.lowStockThreshold.toString());
    if (product.weight) formData.append("weight", product.weight.toString());
    if (product.dimensions) formData.append("dimensions", product.dimensions);
    if (product.attributes.length)
      formData.append("attributes", JSON.stringify(product.attributes));

    if (fileInput.value?.files?.[0]) {
      formData.append("image", fileInput.value.files[0]);
    }

    let response;
    if (isEditMode.value) {
      response = await axios.put(`/api/products/${route.params.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      response = await axios.post("/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    showSuccess.value = true;
  } catch (error: any) {
    apiError.value = error.response?.data?.message || "Error saving product";
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

const cancelForm = () => {
  router.push("/inventory");
};

const addAnother = () => {
  // Reset form
  Object.keys(product).forEach((key) => {
    if (key === "attributes") {
      product.attributes = [];
    } else if (key === "lowStockThreshold") {
      product.lowStockThreshold = 10;
    } else if (key === "id") {
      product.id = null;
    } else {
      product[key as keyof typeof product] =
        key === "stock" ||
        key === "price" ||
        key === "costPrice" ||
        key === "weight"
          ? null
          : "";
    }
  });

  removeImage();
  showSuccess.value = false;
  if (isEditMode.value) {
    router.push("/products/add");
  }
};

const viewInventory = () => {
  router.push("/inventory");
};
</script>

<style scoped lang="scss">
/* Same styles as original */
.add-product {
  max-width: 1200px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: var(--space-4);

  h2 {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: var(--space-1);
  }

  .form-description {
    color: var(--color-grey-600);
  }
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-section {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-md);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-grey-800);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-grey-200);
}

.form-group {
  margin-bottom: var(--space-3);

  label {
    display: block;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-grey-700);
    margin-bottom: var(--space-1);
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--radius-md);
    font-size: var(--font-size-md);
    transition: border-color var(--transition-fast) ease;

    &:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    &.error {
      border-color: var(--color-error);
    }
  }

  textarea {
    resize: vertical;
  }
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.required {
  color: var(--color-error);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.images-section,
.attributes-section {
  grid-column: 1 / -1;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.image-upload-area {
  border: 2px dashed var(--color-grey-300);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  &:hover {
    border-color: var(--color-primary);
    background-color: rgba(15, 82, 186, 0.02);
  }

  i {
    font-size: 2rem;
    color: var(--color-grey-500);
    margin-bottom: var(--space-2);
  }

  p {
    font-size: var(--font-size-md);
    font-weight: 500;
    color: var(--color-grey-700);
    margin-bottom: 4px;
  }

  span {
    font-size: var(--font-size-sm);
    color: var(--color-grey-600);
  }
}

.hidden-file-input {
  display: none;
}

.image-upload-help {
  text-align: center;
  font-size: var(--font-size-xs);
  color: var(--color-grey-600);
}

.image-preview {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: var(--radius-md);
    border: 1px solid var(--color-grey-300);
    padding: 8px;
  }

  .remove-image-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--color-error);
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background-color: var(--color-error-dark);
    }
  }
}

.attributes-container {
  padding: var(--space-2);
}

.attributes-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.attribute-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.attribute-inputs {
  display: flex;
  flex: 1;
  gap: var(--space-2);

  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.attribute-name,
.attribute-value {
  padding: 8px 12px;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.remove-attribute-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--radius-md);
  color: var(--color-grey-700);
  cursor: pointer;

  &:hover {
    background-color: var(--color-grey-100);
    color: var(--color-error);
  }
}

.add-attribute-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  background: none;
  border: 1px dashed var(--color-grey-300);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  &:hover {
    background-color: rgba(15, 82, 186, 0.05);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.cancel-btn {
  padding: 10px 24px;
  background-color: white;
  color: var(--color-grey-700);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all var(--transition-fast) ease;

  &:hover {
    background-color: var(--color-grey-100);
  }
}

.submit-btn {
  padding: 10px 24px;
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;

  &:hover {
    background-color: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.success-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.success-content {
  background-color: white;
  border-radius: var(--radius-md);
  padding: var(--space-5);
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-xl);

  i {
    font-size: 3rem;
    color: var(--color-success);
    margin-bottom: var(--space-3);
  }

  h3 {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--color-grey-900);
    margin-bottom: var(--space-2);
  }

  p {
    color: var(--color-grey-600);
    margin-bottom: var(--space-4);
  }
}

.success-actions {
  display: flex;
  gap: var(--space-2);
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }

  button {
    flex: 1;
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
    }
  }

  .primary-btn {
    background-color: var(--color-primary);
    color: white;
    border: 1px solid var(--color-primary);

    &:hover {
      background-color: var(--color-primary-dark);
    }
  }
}
</style>
