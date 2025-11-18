import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "mezcladitos.db");

if (!fs.existsSync(dbPath)) {
  console.log("🆕 Creando base de datos Mezcladitos...");
}

const db = new Database(dbPath);

// -------------------------------
// Tablas
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
  total REAL NOT NULL
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

console.log("✔ Base de datos cargada");

export default db;





//-------------------------------temporal----------------------------------
const seed = db.prepare("SELECT COUNT(*) as total FROM products").get();

if (seed.total === 0) {
  console.log("🌱 Insertando datos iniciales...");

  const insertCategory = db.prepare(`
    INSERT INTO categories (name) VALUES (?)
  `);

  const insertProduct = db.prepare(`
    INSERT INTO products (name, price, category_id) 
    VALUES (?, ?, ?)
  `);

  const insertInventory = db.prepare(`
    INSERT INTO inventory (product_id, stock, unit)
    VALUES (?, ?, ?)
  `);

  // categorías
  const bebidas = insertCategory.run("Bebidas").lastInsertRowid;
  const cocteles = insertCategory.run("Cocteles").lastInsertRowid;

  // productos
  const cerveza = insertProduct.run("Cerveza", 35, bebidas).lastInsertRowid;
  const paloma = insertProduct.run("Paloma", 55, cocteles).lastInsertRowid;
  const michelada = insertProduct.run("Michelada", 60, cocteles).lastInsertRowid;

  // inventario
  insertInventory.run(cerveza, 100, "unidad");
  insertInventory.run(paloma, 50, "unidad");
  insertInventory.run(michelada, 50, "unidad");

  console.log("✔ Seed completado");
}
