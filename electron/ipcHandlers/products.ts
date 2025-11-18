import db from "../db";
import { ipcMain } from "electron";

ipcMain.handle("products:getAll", () => {
  const stmt = db.prepare(`
    SELECT p.*, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `);
  return stmt.all();
});
