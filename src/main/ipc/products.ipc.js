import { ipcMain } from 'electron';
import { getDB } from '../db/connection.js';
import { QUERIES } from '../db/queries.js';

ipcMain.handle('products:getAll', async () => {
  const db = await getDB();
  return db.all(QUERIES.GET_PRODUCTS);
});

ipcMain.handle('products:add', async (_, product) => {
  const { name, price, category, image } = product;
  const db = await getDB();
  const result = await db.run(QUERIES.ADD_PRODUCT, [name, price, category, image]);
  return { success: true, id: result.lastID };
});

ipcMain.handle('products:delete', async (_, id) => {
  const db = await getDB();
  await db.run(QUERIES.DELETE_PRODUCT, [id]);
  return { success: true };
});
