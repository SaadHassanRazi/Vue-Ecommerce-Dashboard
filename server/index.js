import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(UploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (ext && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png, and .webp formats are allowed!"));
    }
  },
});

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data
let products = [];
let sales = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// API Routes
app.get("/api/products", (req, res) => {
  try {
    console.log("GET /api/products - Fetching products:", products.length); // Debug log
    res.json(products);
  } catch (error) {
    console.error("Error in GET /api/products:", error); // Error log
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

app.get("/api/products/:id", (req, res) => {
  try {
    console.log("GET /api/products/:id - ID:", req.params.id); // Debug log
    const product = products.find((p) => p.id === parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error in GET /api/products/:id:", error); // Error log
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
});

app.post("/api/products", upload.single("image"), (req, res) => {
  try {
    console.log("POST /api/products - Body:", req.body); // Debug log
    const {
      name,
      sku,
      category,
      description,
      price,
      costPrice,
      stock,
      lowStockThreshold,
      weight,
      dimensions,
      attributes,
    } = req.body;

    // Validate required fields
    if (!name || !sku || !category || !price || !stock) {
      return res.status(400).json({
        message: "Missing required fields: name, sku, category, price, stock",
      });
    }

    const newProduct = {
      id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      name,
      sku,
      category,
      description: description || null,
      price: parseFloat(price),
      costPrice: costPrice ? parseFloat(costPrice) : null,
      stock: parseInt(stock),
      lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 10,
      weight: weight ? parseFloat(weight) : null,
      dimensions: dimensions || null,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      attributes: attributes ? JSON.parse(attributes) : [],
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    console.log("Product added:", newProduct); // Debug log
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error in POST /api/products:", error); // Error log
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/products/:id", upload.single("image"), (req, res) => {
  try {
    console.log(
      "PUT /api/products/:id - ID:",
      req.params.id,
      "Body:",
      req.body
    ); // Debug log
    const productIndex = products.findIndex(
      (p) => p.id === parseInt(req.params.id)
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      sku,
      category,
      description,
      price,
      costPrice,
      stock,
      lowStockThreshold,
      weight,
      dimensions,
      attributes,
    } = req.body;

    // Validate required fields
    if (!name || !sku || !category || !price || !stock) {
      return res.status(400).json({
        message: "Missing required fields: name, sku, category, price, stock",
      });
    }

    // Remove old image if new one is uploaded
    if (req.file && products[productIndex].image) {
      const oldImagePath = path.join(__dirname, products[productIndex].image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const updatedProduct = {
      ...products[productIndex],
      name,
      sku,
      category,
      description: description || products[productIndex].description,
      price: parseFloat(price),
      costPrice: costPrice
        ? parseFloat(costPrice)
        : products[productIndex].costPrice,
      stock: parseInt(stock),
      lowStockThreshold: lowStockThreshold
        ? parseInt(lowStockThreshold)
        : products[productIndex].lowStockThreshold,
      weight: weight ? parseFloat(weight) : products[productIndex].weight,
      dimensions: dimensions || products[productIndex].dimensions,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : products[productIndex].image,
      attributes: attributes
        ? JSON.parse(attributes)
        : products[productIndex].attributes,
    };

    products[productIndex] = updatedProduct;
    console.log("Product updated:", updatedProduct); // Debug log
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error in PUT /api/products/:id:", error); // Error log
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/products/:id", (req, res) => {
  try {
    console.log("DELETE /api/products/:id - ID:", req.params.id); // Debug log
    const productIndex = products.findIndex(
      (p) => p.id === parseInt(req.params.id)
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove image if exists
    if (products[productIndex].image) {
      const imagePath = path.join(__dirname, products[productIndex].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    products.splice(productIndex, 1);
    console.log("Product deleted, ID:", req.params.id); // Debug log
    res.status(204).send();
  } catch (error) {
    console.error("Error in DELETE /api/products/:id:", error); // Error log
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

// Sales and revenue endpoints
app.get("/api/sales", (req, res) => {
  try {
    console.log("GET /api/sales - Query:", req.query); // Debug log
    const { startDate, endDate } = req.query;
    let filteredSales = sales;

    if (startDate && endDate) {
      filteredSales = sales.filter(
        (s) =>
          new Date(s.date) >= new Date(startDate) &&
          new Date(s.date) <= new Date(endDate)
      );
    }

    res.json(filteredSales);
  } catch (error) {
    console.error("Error in GET /api/sales:", error); // Error log
    res
      .status(500)
      .json({ message: "Error fetching sales", error: error.message });
  }
});

app.get("/api/revenue/summary", (req, res) => {
  try {
    console.log("GET /api/revenue/summary); // Debug log");
    const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;

    res.json({
      totalSales,
      totalOrders,
      avgOrderValue,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in GET /api/revenue/summary:", error); // Error log
    res
      .status(500)
      .json({
        message: "Error fetching revenue summary",
        error: error.message,
      });
  }
});

app.get("/api/revenue/by-category", (req, res) => {
  try {
    console.log("GET /api/revenue/by-category"); // Debug log
    const revenueByCategory = sales.reduce((acc, sale) => {
      const product = products.find((p) => p.id === sale.productId);
      if (!product) return acc;
      const category = product.category;
      acc[category] = (acc[category] || 0) + sale.amount;
      return acc;
    }, {});

    const result = Object.entries(revenueByCategory).map(
      ([category, revenue]) => ({
        category,
        revenue,
      })
    );

    res.json(result);
  } catch (error) {
    console.error("Error in GET /api/revenue/by-category:", error); // Error log
    res
      .status(500)
      .json({
        message: "Error fetching revenue by category",
        error: error.message,
      });
  }
});

app.get("/api/revenue/by-date", (req, res) => {
  try {
    console.log("GET /api/revenue/by-date - Query:", req.query); // Debug log
    const { period = "daily" } = req.query;
    let result = [];

    if (period === "daily") {
      const dailyRevenue = sales.reduce((acc, sale) => {
        const date = sale.date.split("T")[0];
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, orders: 0 };
        }
        acc[date].revenue += sale.amount;
        acc[date].orders += 1;
        return acc;
      }, {});
      result = Object.values(dailyRevenue).filter(
        (item) =>
          new Date(item.date) >=
          new Date(new Date().setDate(new Date().getDate() - 7))
      );
    } else if (period === "weekly") {
      const weeklyRevenue = sales.reduce((acc, sale) => {
        const date = new Date(sale.date);
        const week = `${date.getFullYear()}-W${
          Math.floor(date.getDate() / 7) + 1
        }`;
        if (!acc[week]) {
          acc[week] = { week, revenue: 0, orders: 0 };
        }
        acc[week].revenue += sale.amount;
        acc[week].orders += 1;
        return acc;
      }, {});
      result = Object.values(weeklyRevenue).filter(
        (item) =>
          new Date(item.week) >=
          new Date(new Date().setDate(new Date().getDate() - 28))
      );
    } else if (period === "monthly") {
      const monthlyRevenue = sales.reduce((acc, sale) => {
        const date = sale.date.split("-").slice(0, 2).join("-");
        if (!acc[date]) {
          acc[date] = { month: date, revenue: 0, orders: 0 };
        }
        acc[date].revenue += sale.amount;
        acc[date].orders += 1;
        return acc;
      }, {});
      result = Object.values(monthlyRevenue).filter(
        (item) =>
          new Date(item.month) >=
          new Date(new Date().setMonth(new Date().getMonth() - 12))
      );
    }

    res.json(result);
  } catch (error) {
    console.error("Error in GET /api/revenue/by-date:", error); // Error log
    res
      .status(500)
      .json({
        message: "Error fetching revenue by date",
        error: error.message,
      });
  }
});

app.get("/api/inventory/low-stock", (req, res) => {
  try {
    console.log("GET /api/inventory/low-stock"); // Debug log
    const lowStockItems = products
      .filter((p) => p.stock <= p.lowStockThreshold)
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold,
        image: p.image,
        severity:
          p.stock === 0
            ? "critical"
            : p.stock <= p.lowStockThreshold / 2
            ? "warning"
            : "info",
      }))
      .sort((a, b) => a.stock - b.stock);

    res.json(lowStockItems);
  } catch (error) {
    console.error("Error in GET /api/inventory/low-stock:", error); // Error log
    res
      .status(500)
      .json({
        message: "Error fetching low stock items",
        error: error.message,
      });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
