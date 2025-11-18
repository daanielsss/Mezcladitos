export const QUERIES = {
  GET_PRODUCTS: `SELECT * FROM products ORDER BY name ASC`,
  ADD_PRODUCT: `INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)`,
  DELETE_PRODUCT: `DELETE FROM products WHERE id = ?`,

  GET_INVENTORY: `SELECT * FROM inventory ORDER BY name ASC`,
  UPDATE_STOCK: `UPDATE inventory SET stock = stock + ? WHERE id = ?`,

  CREATE_TICKET: `INSERT INTO tickets (total, created_at) VALUES (?, datetime('now'))`,
  ADD_TICKET_ITEM: `INSERT INTO ticket_items (ticket_id, product_id, qty, subtotal) VALUES (?, ?, ?, ?)`,

  ADD_EXPENSE: `INSERT INTO expenses (description, amount, created_at) VALUES (?, ?, datetime('now'))`,
  GET_EXPENSES: `SELECT * FROM expenses ORDER BY created_at DESC`,
};
