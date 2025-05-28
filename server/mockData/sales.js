// Generate mock sales data for the past year
const generateMockSales = () => {
  const sales = [];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  // Generate between 800-1200 sales records
  const totalSales = Math.floor(Math.random() * 400) + 800;
  
  for (let i = 0; i < totalSales; i++) {
    // Generate a random date within the past year
    const saleDate = new Date(
      oneYearAgo.getTime() + Math.random() * (today.getTime() - oneYearAgo.getTime())
    );
    
    // Format date as ISO string
    const dateStr = saleDate.toISOString();
    
    // Random product ID (1-10)
    const productId = Math.floor(Math.random() * 10) + 1;
    
    // Random quantity (1-5)
    const quantity = Math.floor(Math.random() * 5) + 1;
    
    // Random price based on product ID
    let basePrice;
    if (productId === 1) basePrice = 1199.99;      // iPhone
    else if (productId === 2) basePrice = 1299.99;  // Samsung
    else if (productId === 3) basePrice = 2499.99;  // MacBook
    else if (productId === 4) basePrice = 249.99;   // AirPods
    else if (productId === 5) basePrice = 129.99;   // Nike
    else if (productId === 6) basePrice = 79.99;    // Levi's
    else if (productId === 7) basePrice = 649.99;   // Dyson
    else if (productId === 8) basePrice = 399.99;   // KitchenAid
    else if (productId === 9) basePrice = 349.99;   // Sony
    else basePrice = 139.99;                        // Patagonia
    
    // Add some small variation to price
    const price = basePrice * (1 + (Math.random() * 0.1 - 0.05));
    
    // Calculate total amount
    const amount = price * quantity;
    
    // Random channel
    const channels = ['Website', 'Amazon', 'Walmart', 'eBay', 'Retail Store'];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    
    // Random order status
    const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Refunded'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Random customer ID (1-100)
    const customerId = Math.floor(Math.random() * 100) + 1;
    
    sales.push({
      id: i + 1,
      date: dateStr,
      productId,
      quantity,
      price: parseFloat(price.toFixed(2)),
      amount: parseFloat(amount.toFixed(2)),
      channel,
      status,
      customerId
    });
  }
  
  // Sort by date, newest first
  return sales.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export default generateMockSales();