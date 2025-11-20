import { ipcMain } from "electron";
import Database from "better-sqlite3";

// Definimos tipos básicos para evitar errores de TS
interface ProductData {
  name: string;
  price: number;
  categoryId: number;
  image?: string;
  stock?: number;
}

interface TicketItem {
  ticket_id: number;
  product_id: number;
  qty: number;
  price: number;
}

interface ExpenseData {
  amount: number;
  category: string;
  note?: string;
}

export function registerIpcHandlers(db: Database.Database) {
  
    // NUEVO: Obtener ítems de un ticket específico
  ipcMain.handle("tickets:getItems", (_, ticket_id: number) => {
    const stmt = db.prepare(`
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
  
  // --- PRODUCTOS ---
  ipcMain.handle("products:getAll", () => {
    // Unimos productos con categorías
    const stmt = db.prepare(`
      SELECT p.*, c.name as category 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name ASC
    `);
    return stmt.all();
  });

  ipcMain.handle("products:add", (_, product: ProductData) => {
    const { name, price, categoryId, image, stock } = product;
    const stmt = db.prepare(
      "INSERT INTO products (name, price, category_id, image, stock) VALUES (?, ?, ?, ?, ?)"
    );
    const info = stmt.run(name, price, categoryId, image || null, stock || 0);
    return { id: info.lastInsertRowid };
  });

  ipcMain.handle("products:delete", (_, id: number) => {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
    return { success: true };
  });

  // --- INVENTARIO ---
  ipcMain.handle("inventory:get", () => {
    // Por ahora usamos la tabla products como fuente de verdad simple
    return db.prepare("SELECT * FROM products").all();
  });

  ipcMain.handle("inventory:updateStock", (_, { id, qty }) => {
    db.prepare("UPDATE products SET stock = stock + ? WHERE id = ?").run(qty, id);
    return { success: true };
  });

  // --- TICKETS (CLIENTES) ---
  ipcMain.handle("tickets:create", (_, total: number) => {
    const stmt = db.prepare("INSERT INTO tickets (total, datetime) VALUES (?, DATETIME('now'))");
    const info = stmt.run(total || 0);
    return { id: info.lastInsertRowid };
  });

  ipcMain.handle("tickets:addItem", (_, item: TicketItem) => {
    const { ticket_id, product_id, qty, price } = item;
    const subtotal = qty * price;

    // Transacción: Agregar item + Restar Inventario + Actualizar Total del Ticket
    const transaction = db.transaction(() => {
      // 1. Insertar item
      db.prepare(`
        INSERT INTO ticket_items (ticket_id, product_id, quantity, subtotal)
        VALUES (?, ?, ?, ?)
      `).run(ticket_id, product_id, qty, subtotal);

      // 2. Actualizar total del ticket
      db.prepare(`
        UPDATE tickets SET total = total + ? WHERE id = ?
      `).run(subtotal, ticket_id);

      // 3. Descontar inventario
      db.prepare(`
        UPDATE products SET stock = stock - ? WHERE id = ?
      `).run(qty, product_id);
    });

    transaction();
    return { success: true };
  });

  ipcMain.handle("tickets:close", (_, ticket_id: number) => {
    db.prepare("UPDATE tickets SET closed_at = DATETIME('now') WHERE id = ?").run(ticket_id);
    return { success: true };
  });

  // --- GASTOS ---
  ipcMain.handle("expenses:add", (_, data: ExpenseData) => {
    const stmt = db.prepare(
      "INSERT INTO expenses (amount, category, note, datetime) VALUES (?, ?, ?, DATETIME('now'))"
    );
    const info = stmt.run(data.amount, data.category, data.note || "");
    return { id: info.lastInsertRowid };
  });

  ipcMain.handle("expenses:getAll", () => {
    return db.prepare("SELECT * FROM expenses ORDER BY datetime DESC").all();
  });
}