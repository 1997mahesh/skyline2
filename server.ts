import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "public", "uploads", "products");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const db = new Database("skyline.db");
const JWT_SECRET = process.env.JWT_SECRET || "skyline-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer', -- 'customer', 'admin', 'dealer'
    phone TEXT,
    gst_number TEXT,
    is_approved INTEGER DEFAULT 1, -- For dealers
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    dealer_price REAL,
    moq INTEGER DEFAULT 1,
    stock INTEGER DEFAULT 0,
    images TEXT, -- JSON array
    specifications TEXT, -- JSON object
    is_featured INTEGER DEFAULT 0,
    is_new INTEGER DEFAULT 0,
    rating REAL DEFAULT 4.5,
    application TEXT, -- 'home', 'office', etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    address_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT DEFAULT 'COD',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type TEXT DEFAULT 'shipping', -- 'shipping', 'billing'
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS store_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
  );
`);

  // Migration: Add address_id to orders if it doesn't exist
  const ordersTableInfo = db.prepare("PRAGMA table_info(orders)").all() as any[];
  const hasAddressId = ordersTableInfo.some(col => col.name === 'address_id');
  if (!hasAddressId) {
    try {
      db.prepare("ALTER TABLE orders ADD COLUMN address_id INTEGER REFERENCES addresses(id)").run();
      console.log("Added address_id column to orders table");
    } catch (e) {
      console.error("Failed to add address_id column:", e);
    }
  }

// Seed Data if empty
try {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    const adminPassword = bcrypt.hashSync("admin123", 10);
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      "Admin", "admin@skylinelights.com", adminPassword, "admin"
    );

    const userPassword = bcrypt.hashSync("123456", 10);
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      "Demo User", "user@skylinelights.com", userPassword, "customer"
    );
  }
} catch (err) {
  console.error("Failed to seed users:", err);
}

try {
  const settingsCount = db.prepare("SELECT COUNT(*) as count FROM store_settings").get() as { count: number };
  if (settingsCount.count === 0) {
    const settings = [
      { key: 'store_name', value: 'Skyline Lights' },
      { key: 'logo', value: '/logo.png' },
      { key: 'contact_email', value: 'contact@skylinelights.com' },
      { key: 'contact_phone', value: '+91 9226645159' },
      { key: 'gst_number', value: '27AAACG1234A1Z5' },
      { key: 'address', value: '123, Light Street, Mumbai, Maharashtra' }
    ];
    const insertSetting = db.prepare("INSERT INTO store_settings (key, value) VALUES (?, ?)");
    settings.forEach(s => insertSetting.run(s.key, s.value));
  }
} catch (err) {
  console.error("Failed to seed settings:", err);
}

try {
  const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
    if (categoryCount.count === 0) {
      const categories = [
        { name: 'LED Bulbs', slug: 'led-bulbs', image: 'https://picsum.photos/seed/bulb/400/400' },
        { name: 'Panel Lights', slug: 'panel-lights', image: 'https://picsum.photos/seed/panel/400/400' },
        { name: 'COB Lights', slug: 'cob-lights', image: 'https://picsum.photos/seed/cob/400/400' },
        { name: 'Wall Lights', slug: 'wall-lights', image: 'https://picsum.photos/seed/wall/400/400' },
        { name: 'Hanging Lights', slug: 'hanging-lights', image: 'https://picsum.photos/seed/hanging/400/400' },
        { name: 'Outdoor Lights', slug: 'outdoor-lights', image: 'https://picsum.photos/seed/outdoor/400/400' },
        { name: 'Decorative Lights', slug: 'decorative-lights', image: 'https://picsum.photos/seed/decorative/400/400' },
        { name: 'Street Lights', slug: 'street-lights', image: 'https://picsum.photos/seed/street/400/400' },
        { name: 'Drivers & Accessories', slug: 'drivers-accessories', image: 'https://picsum.photos/seed/driver/400/400' },
        { name: 'Chandeliers', slug: 'chandeliers', image: 'https://picsum.photos/seed/chandeliers/400/400' },
        { name: 'Pendant Lights', slug: 'pendant-lights', image: 'https://picsum.photos/seed/pendant/400/400' },
        { name: 'Step Lights', slug: 'step-lights', image: 'https://picsum.photos/seed/step/400/400' },
        { name: 'Track Lights', slug: 'track-lights', image: 'https://picsum.photos/seed/track/400/400' },
      ];
    const insertCat = db.prepare("INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)");
    categories.forEach(c => insertCat.run(c.name, c.slug, c.image));
  }
} catch (err) {
  console.error("Failed to seed categories:", err);
}

try {
  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  if (productCount.count === 0) {
    const products = [
      { category_id: 1, name: '9W LED Bulb', slug: '9w-led-bulb', price: 99, stock: 100, application: 'home', is_featured: 1, is_new: 0, images: JSON.stringify(['https://picsum.photos/seed/bulb1/400/400']) },
      { category_id: 1, name: '12W LED Bulb', slug: '12w-led-bulb', price: 149, stock: 50, application: 'home', is_featured: 0, is_new: 1, images: JSON.stringify(['https://picsum.photos/seed/bulb2/400/400']) },
      { category_id: 2, name: '15W Slim Panel', slug: '15w-slim-panel', price: 499, stock: 30, application: 'office', is_featured: 1, is_new: 0, images: JSON.stringify(['https://picsum.photos/seed/panel1/400/400']) },
      { category_id: 3, name: '7W COB Focus', slug: '7w-cob-focus', price: 350, stock: 20, application: 'shop', is_featured: 0, is_new: 1, images: JSON.stringify(['https://picsum.photos/seed/cob1/400/400']) },
      { category_id: 4, name: 'Modern Wall Sconce', slug: 'modern-wall-sconce', price: 1200, stock: 15, application: 'hotel', is_featured: 1, is_new: 0, images: JSON.stringify(['https://picsum.photos/seed/wall1/400/400']) },
      { category_id: 5, name: 'Vintage Edison Chandelier', slug: 'vintage-edison-chandelier', price: 4500, stock: 5, application: 'decorative', is_featured: 0, is_new: 1, images: JSON.stringify(['https://picsum.photos/seed/hanging1/400/400']) },
      { category_id: 6, name: '50W LED Flood Light', slug: '50w-led-flood-light', price: 1800, stock: 25, application: 'outdoor', is_featured: 1, is_new: 0, images: JSON.stringify(['https://picsum.photos/seed/flood1/400/400']) },
      { category_id: 8, name: '100W Street Light', slug: '100w-street-light', price: 3200, stock: 10, application: 'warehouse', is_featured: 0, is_new: 1, images: JSON.stringify(['https://picsum.photos/seed/street1/400/400']) },
    ];
    const insertProd = db.prepare("INSERT INTO products (category_id, name, slug, price, stock, application, is_featured, is_new, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    products.forEach(p => insertProd.run(p.category_id, p.name, p.slug, p.price, p.stock, p.application, p.is_featured, p.is_new, p.images));
  }
} catch (err) {
  console.error("Failed to seed products:", err);
}

try {
  const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
  if (orderCount.count === 0) {
    const demoUser = db.prepare("SELECT id FROM users WHERE email = 'user@skylinelights.com'").get() as { id: number };
    if (demoUser) {
      // Create a default address for demo user
      const addressResult = db.prepare(`
        INSERT INTO addresses (user_id, name, phone, address_line1, city, state, pincode, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(demoUser.id, 'Demo User', '9876543210', '123, Light Street', 'Mumbai', 'Maharashtra', '400001', 1);
      
      const addressId = addressResult.lastInsertRowid;

      const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total_amount, status, payment_method, address_id)
        VALUES (?, ?, ?, ?, ?)
      `).run(demoUser.id, 1048, 'delivered', 'COD', addressId);
      
      const orderId = orderResult.lastInsertRowid;
      db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `).run(orderId, 1, 2, 149);
      db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `).run(orderId, 3, 1, 449);
    }
  }
} catch (err) {
  console.error("Failed to seed orders:", err);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  const authorizeRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    };
  };

  // API Routes
  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT id, name, email, role, phone, gst_number FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.json({ message: "Logged out" });
  });

  app.get("/api/search", (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const products = db.prepare(`
      SELECT * FROM products 
      WHERE name LIKE ? OR description LIKE ? 
      LIMIT 5
    `).all(`%${q}%`, `%${q}%`);
    
    res.json(products);
  });

  app.get("/api/products/:slug", (req, res) => {
    const { slug } = req.params;
    const product = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      db.prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)").run(
        name, email, hashedPassword, 'customer', phone
      );
      
      res.status(201).json({ message: "Registration successful" });
    } catch (e: any) {
      if (e.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Email already registered" });
      }
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  app.get("/api/products", (req, res) => {
    const { category, featured, sort } = req.query;
    let query = "SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id";
    const params: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push("c.slug = ?");
      params.push(category);
    }

    if (featured === 'true') {
      conditions.push("p.is_featured = 1");
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    if (sort === 'new') {
      query += " ORDER BY p.created_at DESC";
    } else if (sort === 'top-rated') {
      query += " ORDER BY p.rating DESC";
    } else {
      query += " ORDER BY p.id DESC";
    }

    const products = db.prepare(query).all(...params);
    res.json(products);
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id 
      GROUP BY c.id
    `).all();
    res.json(categories);
  });

  app.get("/api/admin/stats", authenticateToken, authorizeRole(['admin']), (req: any, res) => {
    const totalRevenue = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE status = 'delivered'").get() as any;
    const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get() as any;
    const customerCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get() as any;
    const lowStock = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock < 10").get() as any;
    
    res.json({
      revenue: totalRevenue.total || 0,
      orders: orderCount.count,
      customers: customerCount.count,
      lowStock: lowStock.count
    });
  });

  // Products CRUD
  app.post("/api/products", authenticateToken, authorizeRole(['admin']), (req, res) => {
    const { category_id, name, slug, description, price, stock, images, application, is_featured, is_new } = req.body;
    try {
      const result = db.prepare(`
        INSERT INTO products (category_id, name, slug, description, price, stock, images, application, is_featured, is_new)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(category_id, name, slug, description, price, stock, JSON.stringify(images), application, is_featured ? 1 : 0, is_new ? 1 : 0);
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/products/:id", authenticateToken, authorizeRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { category_id, name, slug, description, price, stock, images, application, is_featured, is_new } = req.body;
    try {
      db.prepare(`
        UPDATE products SET category_id = ?, name = ?, slug = ?, description = ?, price = ?, stock = ?, images = ?, application = ?, is_featured = ?, is_new = ?
        WHERE id = ?
      `).run(category_id, name, slug, description, price, stock, JSON.stringify(images), application, is_featured ? 1 : 0, is_new ? 1 : 0, id);
      res.json({ message: "Product updated" });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/products/:id", authenticateToken, authorizeRole(['admin']), (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    res.json({ message: "Product deleted" });
  });

  // Orders
  app.get("/api/orders", authenticateToken, (req: any, res) => {
    let orders;
    if (req.user.role === 'admin') {
      orders = db.prepare(`
        SELECT o.*, u.name as user_name, u.email as user_email 
        FROM orders o 
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `).all();
    } else {
      orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    }
    res.json(orders);
  });

  app.post("/api/orders", authenticateToken, (req: any, res) => {
    const { addressId, paymentMethod } = req.body;
    const userId = req.user.id;

    console.log(`Placing order for user ${userId}, address ${addressId}`);

    if (!addressId) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    // Validate address belongs to user
    const address = db.prepare("SELECT id FROM addresses WHERE id = ? AND user_id = ?").get(addressId, userId);
    if (!address) {
      return res.status(400).json({ error: "Invalid delivery address" });
    }

    // Fetch cart items with product details
    const cartItems = db.prepare(`
      SELECT c.product_id, c.quantity, p.price, p.stock, p.name
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `).all(userId) as any[];

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty" });
    }

    // Validate stock
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.name}` });
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
      const insertOrder = db.prepare(`
        INSERT INTO orders (user_id, address_id, total_amount, payment_method, status)
        VALUES (?, ?, ?, ?, 'pending')
      `);
      
      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      const updateStock = db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `);

      const clearCart = db.prepare(`
        DELETE FROM cart WHERE user_id = ?
      `);

      const transaction = db.transaction(() => {
        const result = insertOrder.run(userId, addressId, totalAmount, paymentMethod || 'COD');
        const orderId = result.lastInsertRowid;

        for (const item of cartItems) {
          insertOrderItem.run(orderId, item.product_id, item.quantity, item.price);
          updateStock.run(item.quantity, item.product_id);
        }

        clearCart.run(userId);
        return orderId;
      });

      const orderId = transaction();
      console.log(`Order placed successfully: ${orderId}`);
      res.status(201).json({ orderId });
    } catch (e: any) {
      console.error("Order placement failed:", e);
      res.status(500).json({ error: "Order placement failed: " + e.message });
    }
  });

  app.get("/api/orders/:id", authenticateToken, (req: any, res) => {
    const { id } = req.params;
    const order = db.prepare(`
      SELECT o.*, a.name as address_name, a.phone as address_phone, a.address_line1, a.address_line2, a.city, a.state, a.pincode, a.landmark
      FROM orders o
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = ?
    `).get(id) as any;
    
    if (!order) return res.status(404).json({ error: "Order not found" });
    
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const items = db.prepare(`
      SELECT oi.*, p.name as product_name, p.slug as product_slug, p.images as product_images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(id);

    res.json({ ...order, items });
  });

  app.patch("/api/orders/:id/status", authenticateToken, authorizeRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
    res.json({ message: "Order status updated" });
  });

  // Users
  app.get("/api/users", authenticateToken, authorizeRole(['admin']), (req, res) => {
    const users = db.prepare("SELECT id, name, email, role, phone, gst_number, created_at FROM users").all();
    res.json(users);
  });

  app.put("/api/users/:id", authenticateToken, authorizeRole(['admin']), (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role, gst_number } = req.body;
    try {
      db.prepare("UPDATE users SET name = ?, email = ?, phone = ?, role = ?, gst_number = ? WHERE id = ?").run(
        name, email, phone, role, gst_number, id
      );
      res.json({ message: "User updated" });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/users/:id", authenticateToken, authorizeRole(['admin']), (req: any, res) => {
    const { id } = req.params;
    // Don't allow deleting self
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    res.json({ message: "User deleted" });
  });

  // Addresses
  app.get("/api/addresses", authenticateToken, (req: any, res) => {
    const addresses = db.prepare("SELECT * FROM addresses WHERE user_id = ?").all(req.user.id);
    res.json(addresses);
  });

  app.post("/api/addresses", authenticateToken, (req: any, res) => {
    const { name, phone, address_line1, address_line2, city, state, pincode, landmark, type, is_default } = req.body;
    if (is_default) {
      db.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").run(req.user.id);
    }
    const result = db.prepare(`
      INSERT INTO addresses (user_id, name, phone, address_line1, address_line2, city, state, pincode, landmark, type, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, name, phone, address_line1, address_line2, city, state, pincode, landmark, type || 'shipping', is_default ? 1 : 0);
    res.status(201).json({ id: result.lastInsertRowid });
  });

  // Product Image Upload
  app.post("/api/admin/products/upload", authenticateToken, authorizeRole(['admin']), upload.array("images"), (req: any, res) => {
    const filePaths = req.files.map((file: any) => `/uploads/products/${file.filename}`);
    res.json({ filePaths });
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM store_settings").all();
    const settingsObj = settings.reduce((acc: any, s: any) => {
      acc[s.key] = s.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", authenticateToken, authorizeRole(['admin']), (req, res) => {
    const settings = req.body;
    const upsert = db.prepare("INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)");
    Object.entries(settings).forEach(([key, value]) => {
      upsert.run(key, value as string);
    });
    res.json({ message: "Settings updated" });
  });

  // Wishlist
  app.get("/api/wishlist", authenticateToken, (req: any, res) => {
    const items = db.prepare(`
      SELECT p.*, c.name as category_name FROM products p
      JOIN wishlist w ON p.id = w.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = ?
    `).all(req.user.id);
    res.json(items);
  });

  app.post("/api/wishlist/add", authenticateToken, (req: any, res) => {
    const { product_id } = req.body;
    try {
      db.prepare("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)").run(req.user.id, product_id);
      res.status(201).json({ message: "Added to wishlist" });
    } catch (e) {
      res.status(400).json({ error: "Already in wishlist" });
    }
  });

  app.delete("/api/wishlist/remove/:productId", authenticateToken, (req: any, res) => {
    const { productId } = req.params;
    db.prepare("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?").run(req.user.id, productId);
    res.json({ message: "Removed from wishlist" });
  });

  // Cart
  app.get("/api/cart", authenticateToken, (req: any, res) => {
    const items = db.prepare(`
      SELECT p.*, c.name as category_name, cart.quantity, cart.id as cart_id
      FROM products p
      JOIN cart ON p.id = cart.product_id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE cart.user_id = ?
    `).all(req.user.id);
    res.json(items);
  });

  app.post("/api/cart/add", authenticateToken, (req: any, res) => {
    const { product_id, quantity = 1 } = req.body;
    try {
      const existing = db.prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?").get(req.user.id, product_id) as any;
      if (existing) {
        db.prepare("UPDATE cart SET quantity = quantity + ? WHERE id = ?").run(quantity, existing.id);
      } else {
        db.prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)").run(req.user.id, product_id, quantity);
      }
      res.status(201).json({ message: "Added to cart" });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/cart/update", authenticateToken, (req: any, res) => {
    const { product_id, quantity } = req.body;
    db.prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?").run(quantity, req.user.id, product_id);
    res.json({ message: "Cart updated" });
  });

  app.delete("/api/cart/remove/:productId", authenticateToken, (req: any, res) => {
    const { productId } = req.params;
    db.prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?").run(req.user.id, productId);
    res.json({ message: "Removed from cart" });
  });

  // Vite middleware for development
  app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
