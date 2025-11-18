import { ipcMain } from 'electron';
import { getDB } from '../db/connection.js';
import { QUERIES } from '../db/queries.js';

ipcMain.handle('inventory:get', async () => {
  const db = await getDB();
  return db.all(QUERIES.GET_INVENTORY);
});

ipcMain.handle('inventory:updateStock', async (_, { id, amount }) => {
  const db = await getDB();
  await db.run(QUERIES.UPDATE_STOCK, [amount, id]);
  return { success: true };
});
