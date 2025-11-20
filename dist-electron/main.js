import { app, ipcMain, BrowserWindow } from "electron";
import { createRequire as createRequire$1 } from "node:module";
import { fileURLToPath } from "node:url";
import path$1 from "node:path";
import path from "path";
import { createRequire } from "module";
const require$1 = createRequire(import.meta.url);
const Database = require$1("better-sqlite3");
const dbPath = path.join(app.getPath("userData"), "mezcladitos.db");
console.log("📂 Database Path:", dbPath);
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category_id INTEGER,
    image TEXT,
    stock REAL DEFAULT 0, 
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    stock REAL NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'unidad',
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datetime TEXT NOT NULL,
    total REAL NOT NULL DEFAULT 0,
    closed_at TEXT
  );

  CREATE TABLE IF NOT EXISTS ticket_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity REAL NOT NULL,
    subtotal REAL NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datetime TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    note TEXT
  );
`);
const seed = db.prepare("SELECT COUNT(*) as total FROM categories").get();
if (seed.total === 0) {
  console.log("🌱 Insertando datos semilla...");
  db.exec(`
    INSERT INTO categories (name) VALUES ('Cervezas'), ('Cocteles'), ('Refrescos');
    INSERT INTO products (name, price, category_id, stock) VALUES 
      ('Corona', 35, 1, 100),
      ('Paloma', 65, 2, 50),
      ('Coca Cola', 25, 3, 200);
  `);
}
function registerIpcHandlers(db2) {
  ipcMain.handle("tickets:getItems", (_, ticket_id) => {
    const stmt = db2.prepare(`
      SELECT 
        ti.id,
        ti.product_id,
        ti.quantity as qty,
        ti.subtotal,
        p.name,
        p.price
      FROM ticket_items ti
      JOIN products p ON ti.product_id = p.id
      WHERE ti.ticket_id = ?
    `);
    return stmt.all(ticket_id);
  });
  ipcMain.handle("products:getAll", () => {
    const stmt = db2.prepare(`
      SELECT p.*, c.name as category 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name ASC
    `);
    return stmt.all();
  });
  ipcMain.handle("products:add", (_, product) => {
    const { name, price, categoryId, image, stock } = product;
    const stmt = db2.prepare(
      "INSERT INTO products (name, price, category_id, image, stock) VALUES (?, ?, ?, ?, ?)"
    );
    const info = stmt.run(name, price, categoryId, image || null, stock || 0);
    return { id: info.lastInsertRowid };
  });
  ipcMain.handle("products:delete", (_, id) => {
    db2.prepare("DELETE FROM products WHERE id = ?").run(id);
    return { success: true };
  });
  ipcMain.handle("inventory:get", () => {
    return db2.prepare("SELECT * FROM products").all();
  });
  ipcMain.handle("inventory:updateStock", (_, { id, qty }) => {
    db2.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").run(qty, id);
    return { success: true };
  });
  ipcMain.handle("tickets:create", (_, total) => {
    const stmt = db2.prepare("INSERT INTO tickets (total, datetime) VALUES (?, DATETIME('now'))");
    const info = stmt.run(total || 0);
    return { id: info.lastInsertRowid };
  });
  ipcMain.handle("tickets:addItem", (_, item) => {
    const { ticket_id, product_id, qty, price } = item;
    const subtotal = qty * price;
    const transaction = db2.transaction(() => {
      db2.prepare(`
        INSERT INTO ticket_items (ticket_id, product_id, quantity, subtotal)
        VALUES (?, ?, ?, ?)
      `).run(ticket_id, product_id, qty, subtotal);
      db2.prepare(`
        UPDATE tickets SET total = total + ? WHERE id = ?
      `).run(subtotal, ticket_id);
      db2.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `).run(qty, product_id);
    });
    transaction();
    return { success: true };
  });
  ipcMain.handle("tickets:close", (_, ticket_id) => {
    db2.prepare("UPDATE tickets SET closed_at = DATETIME('now') WHERE id = ?").run(ticket_id);
    return { success: true };
  });
  ipcMain.handle("expenses:add", (_, data) => {
    const stmt = db2.prepare(
      "INSERT INTO expenses (amount, category, note, datetime) VALUES (?, ?, ?, DATETIME('now'))"
    );
    const info = stmt.run(data.amount, data.category, data.note || "");
    return { id: info.lastInsertRowid };
  });
  ipcMain.handle("expenses:getAll", () => {
    return db2.prepare("SELECT * FROM expenses ORDER BY datetime DESC").all();
  });
}
createRequire$1(import.meta.url);
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$1);
process.env.APP_ROOT = path$1.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path$1.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path$1.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path$1.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  registerIpcHandlers(db);
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname$1, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
