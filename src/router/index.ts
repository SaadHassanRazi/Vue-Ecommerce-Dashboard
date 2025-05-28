import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("@/views/Dashboard.vue"),
  },
  {
    path: "/revenue",
    name: "revenue",
    component: () => import("@/views/RevenueAnalysis.vue"),
  },
  {
    path: "/inventory",
    name: "inventory",
    component: () => import("@/views/InventoryManagement.vue"),
  },
  {
    path: "/products/add",
    name: "add-product",
    component: () => import("@/views/AddProduct.vue"),
  },
  {
    path: "/products/edit/:id",
    name: "edit-product",
    component: () => import("@/views/AddProduct.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
});

export default router;
