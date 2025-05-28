export default [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    sku: 'IP15PM-128-BLK',
    category: 'Electronics',
    description: 'Apple iPhone 15 Pro Max with 128GB storage, titanium finish.',
    price: 1199.99,
    costPrice: 899.99,
    stock: 24,
    lowStockThreshold: 10,
    weight: 0.22,
    dimensions: '16.0 x 7.7 x 0.8 cm',
    image: 'https://images.pexels.com/photos/16122015/pexels-photo-16122015.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Color', value: 'Titanium Black' },
      { name: 'Storage', value: '128GB' },
      { name: 'Screen Size', value: '6.7 inches' }
    ],
    createdAt: '2025-03-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    sku: 'SGS24U-256-BLU',
    category: 'Electronics',
    description: 'Samsung Galaxy S24 Ultra with 256GB storage, titanium blue color.',
    price: 1299.99,
    costPrice: 950.00,
    stock: 18,
    lowStockThreshold: 8,
    weight: 0.23,
    dimensions: '16.2 x 7.9 x 0.8 cm',
    image: 'https://images.pexels.com/photos/13339662/pexels-photo-13339662.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Color', value: 'Titanium Blue' },
      { name: 'Storage', value: '256GB' },
      { name: 'Screen Size', value: '6.8 inches' }
    ],
    createdAt: '2025-03-20T14:30:00Z'
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    sku: 'MBP16-M3-SLV',
    category: 'Electronics',
    description: 'Apple MacBook Pro 16" with M3 chip, 16GB RAM, 512GB SSD.',
    price: 2499.99,
    costPrice: 1950.00,
    stock: 12,
    lowStockThreshold: 5,
    weight: 2.15,
    dimensions: '35.6 x 24.8 x 1.6 cm',
    image: 'https://images.pexels.com/photos/669228/pexels-photo-669228.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Processor', value: 'M3 Pro' },
      { name: 'RAM', value: '16GB' },
      { name: 'Storage', value: '512GB SSD' },
      { name: 'Color', value: 'Silver' }
    ],
    createdAt: '2025-02-18T09:15:00Z'
  },
  {
    id: 4,
    name: 'AirPods Pro 2',
    sku: 'APP2-WHT',
    category: 'Electronics',
    description: 'Apple AirPods Pro 2nd generation with active noise cancellation.',
    price: 249.99,
    costPrice: 180.00,
    stock: 35,
    lowStockThreshold: 15,
    weight: 0.05,
    dimensions: '6.0 x 5.4 x 2.4 cm',
    image: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Color', value: 'White' },
      { name: 'Connectivity', value: 'Bluetooth 5.3' },
      { name: 'Battery Life', value: 'Up to 6 hours' }
    ],
    createdAt: '2025-04-05T11:20:00Z'
  },
  {
    id: 5,
    name: 'Nike Air Max 90',
    sku: 'NAM90-10-BLK',
    category: 'Clothing',
    description: 'Nike Air Max 90 in black/white, men\'s size 10.',
    price: 129.99,
    costPrice: 75.00,
    stock: 28,
    lowStockThreshold: 10,
    weight: 0.4,
    dimensions: '30.0 x 20.0 x 15.0 cm',
    image: 'https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Size', value: '10 (US Men\'s)' },
      { name: 'Color', value: 'Black/White' },
      { name: 'Material', value: 'Leather/Synthetic' }
    ],
    createdAt: '2025-03-28T16:45:00Z'
  },
  {
    id: 6,
    name: 'Levi\'s 501 Original Jeans',
    sku: 'L501-32-BLU',
    category: 'Clothing',
    description: 'Levi\'s 501 Original Fit jeans, size 32x32, dark blue wash.',
    price: 79.99,
    costPrice: 45.00,
    stock: 42,
    lowStockThreshold: 15,
    weight: 0.6,
    dimensions: '25.0 x 20.0 x 5.0 cm',
    image: 'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Size', value: '32x32' },
      { name: 'Color', value: 'Dark Blue Wash' },
      { name: 'Style', value: 'Original Fit' },
      { name: 'Material', value: '100% Cotton' }
    ],
    createdAt: '2025-04-10T13:15:00Z'
  },
  {
    id: 7,
    name: 'Dyson V12 Detect Slim',
    sku: 'DV12-SLV',
    category: 'Home & Kitchen',
    description: 'Dyson V12 Detect Slim cordless vacuum with laser dust detection.',
    price: 649.99,
    costPrice: 450.00,
    stock: 6,
    lowStockThreshold: 5,
    weight: 2.4,
    dimensions: '126.0 x 25.0 x 26.0 cm',
    image: 'https://images.pexels.com/photos/6507486/pexels-photo-6507486.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Color', value: 'Silver/Yellow' },
      { name: 'Battery Life', value: 'Up to 60 minutes' },
      { name: 'Weight', value: '2.4 kg' }
    ],
    createdAt: '2025-02-25T10:30:00Z'
  },
  {
    id: 8,
    name: 'KitchenAid Stand Mixer',
    sku: 'KAM-RED',
    category: 'Home & Kitchen',
    description: 'KitchenAid Artisan Series 5-quart stand mixer in empire red.',
    price: 399.99,
    costPrice: 280.00,
    stock: 9,
    lowStockThreshold: 8,
    weight: 11.0,
    dimensions: '36.8 x 37.1 x 23.8 cm',
    image: 'https://images.pexels.com/photos/6996085/pexels-photo-6996085.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Color', value: 'Empire Red' },
      { name: 'Capacity', value: '5-quart' },
      { name: 'Power', value: '325 watts' }
    ],
    createdAt: '2025-03-12T09:00:00Z'
  },
  {
    id: 9,
    name: 'Sony WH-1000XM5',
    sku: 'SWXM5-BLK',
    category: 'Electronics',
    description: 'Sony WH-1000XM5 noise cancelling wireless headphones.',
    price: 349.99,
    costPrice: 240.00,
    stock: 14,
    lowStockThreshold: 10,
    weight: 0.25,
    dimensions: '18.0 x 20.0 x 8.0 cm',
    image: 'https://images.pexels.com/photos/577769/pexels-photo-577769.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Color', value: 'Black' },
      { name: 'Battery Life', value: 'Up to 30 hours' },
      { name: 'Connectivity', value: 'Bluetooth 5.2' }
    ],
    createdAt: '2025-04-02T14:20:00Z'
  },
  {
    id: 10,
    name: 'Patagonia Better Sweater',
    sku: 'PBS-M-GRY',
    category: 'Clothing',
    description: 'Patagonia Better Sweater fleece jacket, men\'s medium, gray.',
    price: 139.99,
    costPrice: 85.00,
    stock: 22,
    lowStockThreshold: 8,
    weight: 0.5,
    dimensions: '30.0 x 25.0 x 4.0 cm',
    image: 'https://images.pexels.com/photos/6766368/pexels-photo-6766368.jpeg?auto=compress&cs=tinysrgb&w=500',
    attributes: [
      { name: 'Size', value: 'Medium' },
      { name: 'Color', value: 'Stonewash Gray' },
      { name: 'Material', value: '100% Recycled Polyester' }
    ],
    createdAt: '2025-03-18T15:45:00Z'
  }
];