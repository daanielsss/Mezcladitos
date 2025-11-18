import { ipcMain } from 'electron';
import { getDB } from '../db/connection.js';
import { QUERIES } from '../db/queries.js';

ipcMain.handle('expenses:add', async (_, data) => {
  const { description, amount } = data;
  const db = await getDB();
  await db.run(QUERIES.ADD_EXPENSE, [description, amount]);
  return { success: true };
});

ipcMain.handle('expenses:getAll', async () => {
  const db = await getDB();
  return db.all(QUERIES.GET_EXPENSES);
});
