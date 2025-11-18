import { app, BrowserWindow } from 'electron';
import './ipc/products.ipc';
import './ipc/inventory.ipc';
import './ipc/tickets.ipc';
import './ipc/expenses.ipc';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: `${__dirname}/preload.js`
    }
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);
