import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { app } from "electron";

// Usar app.getPath para asegurar persistencia en producción
const dbPath = path.join(app.getPath("userData"), "mezcladitos.db");

console.log("📂 Database Path:", dbPath);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// -------------------------------
// Tablas (Schema)
// -------------------------------
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

// Seed Inicial (Opcional: Solo si está vacía)
const seed = db.prepare("SELECT COUNT(*) as total FROM categories").get() as { total: number };
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

export default db;