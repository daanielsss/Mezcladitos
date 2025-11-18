import { app, BrowserWindow } from "electron";
import { initDB } from "./db.js";
import { registerIpcHandlers } from "./ipcHandlers.js";

async function createWindow() {
  const db = await initDB();
  registerIpcHandlers(db);

  const win = new BrowserWindow({
    webPreferences: {
      preload: "./preload.js",
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);
