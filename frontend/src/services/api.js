import { PRODUCTS, CATEGORIES } from '../data/mockData';

// Helper to simulate network latency
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Centralized LocalStorage Database Initialization
export function initDatabase() {
  // 1. Initialize Products
  if (!localStorage.getItem('eyara_products')) {
    localStorage.setItem('eyara_products', JSON.stringify(PRODUCTS));
  }

  // 2. Initialize Orders
  if (!localStorage.getItem('eyara_orders')) {
    // Seed some initial default mock orders for the admin to view
    const initialOrders = [
      {
        orderId: "EYARA-928135",
        status: "Delivered",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        items: [
          {
            id: "amig-01",
            name: "Cozy Crochet Bunny Plush",
            color: "Off-white",
            quantity: 1,
            price: 899
          },
          {
            id: "key-01",
            name: "Blooming Daisy Keychain",
            color: "Classic Yellow",
            quantity: 2,
            price: 249
          }
        ],
        shippingDetails: {
          name: "Aditi Sharma",
          email: "aditi.sharma@example.com",
          phone: "9876543210",
          address: "Flat 402, Sunshine Heights, Juhu",
          city: "Mumbai",
          state: "Maharashtra",
          pinCode: "400049"
        },
        paymentMethod: "cod",
        pricing: {
          subtotal: 1397,
          shippingFee: 0,
          grandTotal: 1397
        }
      },
      {
        orderId: "EYARA-481923",
        status: "Processing",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        items: [
          {
            id: "amig-02",
            name: "Tiny Turtle Amigurumi",
            color: "Sage Green",
            quantity: 1,
            price: 499
          },
          {
            id: "book-01",
            name: "Autumn Leaf Booksprout",
            color: "Forest Green",
            quantity: 1,
            price: 199
          }
        ],
        shippingDetails: {
          name: "Rohan Mehta",
          email: "rohan.mehta@example.com",
          phone: "9822110033",
          address: "Sector 4, HSR Layout, 12th Cross",
          city: "Bangalore",
          state: "Karnataka",
          pinCode: "560102"
        },
        paymentMethod: "online",
        pricing: {
          subtotal: 698,
          shippingFee: 60,
          grandTotal: 758
        }
      }
    ];
    localStorage.setItem('eyara_orders', JSON.stringify(initialOrders));
  }
}

// Auto-run initialization on module import
initDatabase();

// Load data arrays helper
const loadProducts = () => {
  const raw = JSON.parse(localStorage.getItem('eyara_products') || '[]');
  return raw.map(p => {
    if (!p.images || !Array.isArray(p.images) || p.images.length === 0) {
      return {
        ...p,
        images: p.image ? [p.image] : ["/placeholder-image.svg"]
      };
    }
    return p;
  });
};
const saveProducts = (prods) => localStorage.setItem('eyara_products', JSON.stringify(prods));

const loadOrders = () => JSON.parse(localStorage.getItem('eyara_orders') || '[]');
const saveOrders = (ords) => localStorage.setItem('eyara_orders', JSON.stringify(ords));

export const apiService = {
  
  // ==================== CUSTOMER ENDPOINTS ====================
  
  // Fetch all products (reads from dynamic local storage)
  async getProducts({ category, search, minPrice, maxPrice, sortBy } = {}) {
    await delay(200);
    let filtered = loadProducts();

    // Search query filter
    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price range filters
    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    // Sorting
    if (sortBy) {
      if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'bestseller') {
        filtered.sort((a, b) => {
          if (a.bestseller && !b.bestseller) return -1;
          if (!a.bestseller && b.bestseller) return 1;
          return b.rating - a.rating;
        });
      }
    }

    return filtered;
  },

  // Fetch product by ID
  async getProductById(id) {
    await delay(100);
    const prods = loadProducts();
    const product = prods.find(p => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found.`);
    }
    return product;
  },

  // Fetch all categories
  async getCategories() {
    await delay(50);
    return ['All', ...CATEGORIES];
  },

  // Fetch related products (same category)
  async getRelatedProducts(productId, category, limit = 4) {
    await delay(100);
    const prods = loadProducts();
    const related = prods.filter(p => p.category === category && p.id !== productId);
    if (related.length < limit) {
      const others = prods.filter(p => p.id !== productId && !related.find(r => r.id === p.id));
      related.push(...others.slice(0, limit - related.length));
    }
    return related.slice(0, limit);
  },

  // Submit Order (Customer Checkout)
  async placeOrder(orderData) {
    await delay(800);
    const orderId = "EYARA-" + Math.floor(100000 + Math.random() * 900000);
    const completedOrder = {
      ...orderData,
      orderId,
      status: "Pending", // Default order status is Pending
      date: new Date().toISOString()
    };
    
    // Save to shared localStorage database
    const existingOrders = loadOrders();
    existingOrders.push(completedOrder);
    saveOrders(existingOrders);

    // Also decrement product stock levels dynamically! (simulates inventory control)
    const prods = loadProducts();
    let updatedProducts = prods.map(prod => {
      const orderItem = orderData.items.find(item => item.id === prod.id);
      if (orderItem) {
        // Assume default starting stock is 12 if undefined
        const currentStock = prod.stock !== undefined ? prod.stock : 12;
        const newStock = Math.max(0, currentStock - orderItem.quantity);
        return {
          ...prod,
          stock: newStock,
          stockStatus: newStock === 0 ? 'out-of-stock' : newStock <= 5 ? 'low-stock' : 'in-stock'
        };
      }
      return prod;
    });
    saveProducts(updatedProducts);

    return completedOrder;
  },

  // Submit Contact Form
  async submitContact(contactData) {
    await delay(300);
    return { success: true, message: "Your message has been sent successfully!" };
  },

  // Customer Login
  async login(email, password) {
    await delay(200);
    if (email && password) {
      const user = {
        name: email.split('@')[0],
        email,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('eyara_user', JSON.stringify(user));
      return user;
    }
    throw new Error("Invalid email or password");
  },

  // Customer SignUp
  async signup(name, email, password) {
    await delay(200);
    if (name && email && password) {
      const user = {
        name,
        email,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('eyara_user', JSON.stringify(user));
      return user;
    }
    throw new Error("Registration details invalid");
  },

  // ==================== ADMIN ENDPOINTS ====================

  // Admin login credentials validator (demo only)
  async adminLogin(email, password) {
    await delay(400);
    if (email === 'admin@eyara.com' && password === 'password') {
      localStorage.setItem('eyara_admin_logged_in', 'true');
      const adminProfile = {
        name: "Boutique Owner",
        email: "admin@eyara.com",
        role: "admin"
      };
      localStorage.setItem('eyara_admin_profile', JSON.stringify(adminProfile));
      return adminProfile;
    }
    throw new Error("Invalid admin email or password. Use demo details: admin@eyara.com / password.");
  },

  // Fetch metrics data summary for Admin Dashboard
  async getAdminDashboardData() {
    await delay(300);
    const ords = loadOrders();
    const prods = loadProducts();

    // 1. Calculate orders count
    const totalOrders = ords.length;
    const pendingOrders = ords.filter(o => o.status === 'Pending').length;

    // 2. Calculate total revenue (excl. Cancelled)
    const totalRevenue = ords
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.pricing.grandTotal, 0);

    // 3. Calculate product levels
    const totalProducts = prods.length;
    
    // Check stock levels. Assume a product has stock field. Add one if missing in database.
    const lowStockProducts = prods.filter(p => {
      const stock = p.stock !== undefined ? p.stock : 8; // default to 8 if not specified
      return stock <= 5;
    }).length;

    // 4. Calculate unique customer count
    const uniqueEmails = new Set(ords.map(o => o.shippingDetails.email));
    const totalCustomers = uniqueEmails.size;

    // 5. Select 5 most recent orders
    const recentOrders = [...ords]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // 6. Assemble simple sales logs (e.g. past 5 orders total) for visual overview
    const salesHistory = ords
      .filter(o => o.status !== 'Cancelled')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(o => ({
        date: new Date(o.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        amount: o.pricing.grandTotal
      }));

    return {
      metrics: {
        totalOrders,
        pendingOrders,
        totalRevenue,
        totalProducts,
        lowStockProducts,
        totalCustomers
      },
      recentOrders,
      salesHistory
    };
  },

  // Admin: Get all orders with search query and status filters
  async getAdminOrders({ search, status } = {}) {
    await delay(200);
    let ords = loadOrders();

    // Filter by status
    if (status && status !== 'All') {
      ords = ords.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by search (id, customer, phone)
    if (search) {
      const q = search.toLowerCase().trim();
      ords = ords.filter(o => 
        o.orderId.toLowerCase().includes(q) || 
        o.shippingDetails.name.toLowerCase().includes(q) ||
        o.shippingDetails.phone.includes(q)
      );
    }

    // Sort by date newest first
    return ords.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Admin: Get specific order by ID
  async getAdminOrderById(id) {
    await delay(100);
    const ords = loadOrders();
    const order = ords.find(o => o.orderId === id);
    if (!order) {
      throw new Error(`Order ${id} not found.`);
    }
    return order;
  },

  // Admin: Update order status
  async updateAdminOrderStatus(id, newStatus) {
    await delay(400);
    const ords = loadOrders();
    const idx = ords.findIndex(o => o.orderId === id);
    if (idx === -1) {
      throw new Error(`Order ${id} not found.`);
    }
    
    ords[idx].status = newStatus;
    // Map payment status if order is Delivered
    if (newStatus === 'Delivered') {
      ords[idx].paymentStatus = 'Paid';
    }
    
    saveOrders(ords);
    return ords[idx];
  },

  // Admin: Get all products in inventory
  async getAdminProducts({ search, category } = {}) {
    await delay(200);
    let prods = loadProducts();

    // Filter by Category
    if (category && category !== 'All') {
      prods = prods.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Search query
    if (search) {
      const q = search.toLowerCase().trim();
      prods = prods.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.id.toLowerCase().includes(q)
      );
    }

    return prods;
  },

  // Admin: Add new product
  async addAdminProduct(productData) {
    await delay(500);
    const prods = loadProducts();
    
    // Auto generate ID
    const prefix = productData.category.slice(0, 3).toLowerCase();
    const id = `${prefix}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = {
      ...productData,
      id,
      stock: parseInt(productData.stock, 10) || 10,
      price: parseFloat(productData.price) || 0,
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
      rating: 5.0,
      reviewsCount: 0,
      stockStatus: (parseInt(productData.stock, 10) || 10) === 0 ? 'out-of-stock' : (parseInt(productData.stock, 10) || 10) <= 5 ? 'low-stock' : 'in-stock',
      details: productData.details || ["100% Cotton", "Handmade stitch details"],
      careInstructions: productData.careInstructions || "Gently hand wash in cold water."
    };

    prods.unshift(newProduct);
    saveProducts(prods);
    return newProduct;
  },

  // Admin: Update existing product info
  async updateAdminProduct(id, productData) {
    await delay(500);
    const prods = loadProducts();
    const idx = prods.findIndex(p => p.id === id);
    if (idx === -1) {
      throw new Error(`Product ${id} not found.`);
    }

    const currentProduct = prods[idx];
    const newStock = parseInt(productData.stock, 10);
    const updatedProduct = {
      ...currentProduct,
      ...productData,
      stock: newStock,
      price: parseFloat(productData.price) || 0,
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
      stockStatus: newStock === 0 ? 'out-of-stock' : newStock <= 5 ? 'low-stock' : 'in-stock'
    };

    prods[idx] = updatedProduct;
    saveProducts(prods);
    return updatedProduct;
  },

  // Admin: Remove product from inventory
  async deleteAdminProduct(id) {
    await delay(300);
    const prods = loadProducts();
    const filtered = prods.filter(p => p.id !== id);
    saveProducts(filtered);
    return { success: true, message: `Product ${id} deleted.` };
  },

  // Admin: Retrieve summary of customers derived from transactions
  async getAdminCustomers() {
    await delay(200);
    const ords = loadOrders();
    const customerMap = {};

    // Group transactions by customer email
    ords.forEach(order => {
      const email = order.shippingDetails.email.toLowerCase().trim();
      const name = order.shippingDetails.name;
      const phone = order.shippingDetails.phone;
      const grandTotal = order.pricing.grandTotal;
      const orderDate = new Date(order.date);

      if (!customerMap[email]) {
        customerMap[email] = {
          name,
          email,
          phone,
          ordersCount: 0,
          totalSpent: 0,
          lastOrderDate: orderDate
        };
      }

      customerMap[email].ordersCount += 1;
      // Accumulate spent if order is not Cancelled
      if (order.status !== 'Cancelled') {
        customerMap[email].totalSpent += grandTotal;
      }
      
      // Update last order date if newer
      if (orderDate > customerMap[email].lastOrderDate) {
        customerMap[email].lastOrderDate = orderDate;
      }
    });

    return Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);
  }
};
