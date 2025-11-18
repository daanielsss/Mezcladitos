import { ipcMain } from 'electron';
import { getDB } from '../db/connection.js';
import { QUERIES } from '../db/queries.js';

ipcMain.handle('tickets:create', async (_, total) => {
  const db = await getDB();
  const ticket = await db.run(QUERIES.CREATE_TICKET, [total]);
  return ticket.lastID;
});

ipcMain.handle('tickets:addItem', async (_, item) => {
  const { ticket_id, product_id, qty, subtotal } = item;
  const db = await getDB();
  await db.run(QUERIES.ADD_TICKET_ITEM, [ticket_id, product_id, qty, subtotal]);
  return { success: true };
});
