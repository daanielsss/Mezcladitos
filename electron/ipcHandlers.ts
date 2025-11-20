import { ipcMain } from "electron";
import Database from "better-sqlite3";
import { Product } from "../src/types/Product";

export function registerIpcHandlers(db: Database.Database) {
  // ===================== PRODUCTS & INVENTORY =====================
  ipcMain.handle("products:getAll", () => {
    // Joins products, categories, and inventory to match the frontend Product type.
    const stmt = db.prepare(`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        c.name AS category, 
        IFNULL(i.stock, 0) AS stock, 
        p.image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      ORDER BY p.name ASC
    `);
    return stmt.all();
  });

  ipcMain.handle("products:add", (
    _,
    product: Omit<Product, "id" | "stock" | "category"> & { categoryId: number }
  ) => {
    // 1. Insert product
    const insertProduct = db.prepare(`
      INSERT INTO products (name, price, category_id, image) 
      VALUES (?, ?, ?, ?)
    `);
    
    // Use transaction to ensure both inserts succeed
    const runInTransaction = db.transaction((product) => {
      const result = insertProduct.run(
        product.name,
        product.price,
        product.categoryId,
        product.image || null
      );
      const productId = result.lastInsertRowid;

      // 2. Insert initial inventory record (default stock: 0)
      const insertInventory = db.prepare(`
        INSERT INTO inventory (product_id, stock, unit)
        VALUES (?, 0, 'unidad')
      `);
      insertInventory.run(productId);

      return { id: productId };
    });

    return runInTransaction(product);
  });

  ipcMain.handle("products:delete", (_, id: number) => {
    // Delete associated records first (ticket_items, inventory) due to FOREIGN KEY constraints.
    db.transaction(() => {
        db.prepare('DELETE FROM ticket_items WHERE product_id = ?').run(id);
        db.prepare('DELETE FROM inventory WHERE product_id = ?').run(id);
        db.prepare('DELETE FROM products WHERE id = ?').run(id);
    })();
    return { success: true };
  });

  // Since the frontend uses 'inventory:get' for the Inventory page, we link it here.
  ipcMain.handle("inventory:get", () => {
    return db.prepare(`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        c.name AS category, 
        IFNULL(i.stock, 0) AS stock, 
        p.image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      ORDER BY p.name ASC
    `).all();
  });

  // Updates stock in the dedicated inventory table by product_id
  ipcMain.handle("inventory:updateStock", (_, { productId, amount }) => {
    db.prepare("UPDATE inventory SET stock = stock + ? WHERE product_id = ?").run(amount, productId);
    return { success: true };
  });


  // ===================== TICKETS =====================
  ipcMain.handle("tickets:create", () => {
    // Creates new ticket with current timestamp and total 0
    const result = db.prepare("INSERT INTO tickets (total, datetime) VALUES (0, DATETIME('now'))").run();
    return { id: result.lastID };
  });

  ipcMain.handle("tickets:addItem", (
    _,
    item: { ticket_id: number; product_id: number; qty: number; price: number }
  ) => {
    const { ticket_id, product_id, qty, price } = item;
    
    // Use transaction to ensure atomicity
    db.transaction(() => {
        // 1. Add item to ticket_items
        db.prepare(
          "INSERT INTO ticket_items (ticket_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)"
        ).run(ticket_id, product_id, qty, qty * price);

        // 2. Update ticket total
        db.prepare(
          "UPDATE tickets SET total = total + ? WHERE id = ?"
        ).run(qty * price, ticket_id);

        // 3. Update inventory stock (reduce) - assumes inventory.product_id matches products.id
        db.prepare(
            "UPDATE inventory SET stock = stock - ? WHERE product_id = ?"
        ).run(qty, product_id);
    })();

    return { success: true };
  });
  
  // To close a ticket and log the transaction date
  ipcMain.handle("tickets:close", (_, ticket_id: number) => {
    db.prepare("UPDATE tickets SET datetime = DATETIME('now') WHERE id = ?").run(ticket_id);
    return { success: true };
  });

  // ===================== EXPENSES =====================
  ipcMain.handle("expenses:add", (_, data: { amount: number; category: string; note?: string }) => {
    const { amount, category, note } = data;
    const result = db.prepare(
      "INSERT INTO expenses (datetime, amount, category, note) VALUES (DATETIME('now'), ?, ?, ?)"
    ).run(amount, category, note || null);
    
    return { id: result.lastID };
  });

  ipcMain.handle("expenses:getAll", () => {
    return db.prepare("SELECT * FROM expenses ORDER BY datetime DESC").all();
  });
}