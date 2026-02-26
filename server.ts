import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    application TEXT, -- 'home', 'office', etc.
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
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
`);

// Seed Data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Admin", "admin@skylinelights.com", hashedPassword, "admin"
  );
}

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
  ];
  const insertCat = db.prepare("INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)");
  categories.forEach(c => insertCat.run(c.name, c.slug, c.image));
}

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
    const { name, email, password, role, phone, gst_number } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
      const result = db.prepare("INSERT INTO users (name, email, password, role, phone, gst_number) VALUES (?, ?, ?, ?, ?, ?)").run(
        name, email, hashedPassword, role || 'customer', phone, gst_number
      );
      
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid) as any;
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e: any) {
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
    const products = db.prepare("SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id").all();
    res.json(products);
  });

  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
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

  // Vite middleware for development
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
