import { ipcMain } from "electron";

export function registerIpcHandlers(db) {

  // --------------------- PRODUCTS ---------------------
  ipcMain.handle("products:getAll", async () => {
    return await db.all("SELECT * FROM products ORDER BY name");
  });

  ipcMain.handle("products:add", async (_, p) => {
    const { name, price, image, stock } = p;
    const result = await db.run(
      "INSERT INTO products (name, price, image, stock) VALUES (?, ?, ?, ?)",
      [name, price, image, stock]
    );
    return { id: result.lastID };
  });

  ipcMain.handle("products:updateStock", async (_, { id, qty }) => {
    await db.run("UPDATE products SET stock = stock + ? WHERE id = ?", [
      qty,
      id,
    ]);
    return true;
  });

  // --------------------- TICKETS ---------------------
  ipcMain.handle("tickets:create", async () => {
    const result = await db.run("INSERT INTO tickets (total) VALUES (0)");
    return { id: result.lastID };
  });

  ipcMain.handle("tickets:addItem", async (_, item) => {
    const { ticket_id, product_id, qty, price } = item;

    await db.run(
      "INSERT INTO ticket_items (ticket_id, product_id, qty, price) VALUES (?, ?, ?, ?)",
      [ticket_id, product_id, qty, price]
    );

    await db.run(
      "UPDATE tickets SET total = total + ? WHERE id = ?",
      [qty * price, ticket_id]
    );

    await db.run(
      "UPDATE products SET stock = stock - ? WHERE id = ?",
      [qty, product_id]
    );

    return true;
  });

  ipcMain.handle("tickets:close", async (_, ticket_id) => {
    await db.run(
      "UPDATE tickets SET closed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [ticket_id]
    );
    return true;
  });

  // --------------------- EXPENSES ---------------------
  ipcMain.handle("expenses:add", async (_, data) => {
    const { description, amount } = data;
    const r = await db.run(
      "INSERT INTO expenses (description, amount) VALUES (?, ?)",
      [description, amount]
    );
    return { id: r.lastID };
  });

  ipcMain.handle("expenses:getAll", async () => {
    return await db.all("SELECT * FROM expenses ORDER BY created_at DESC");
  });
}
