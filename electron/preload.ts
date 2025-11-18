import { contextBridge, ipcRenderer } from "electron";

export const api = {
  // PRODUCTS
  getProducts: () => ipcRenderer.invoke("products:getAll"),
  addProduct: (data) => ipcRenderer.invoke("products:add", data),
  deleteProduct: (id) => ipcRenderer.invoke("products:delete", id),

  // INVENTORY
  getInventory: () => ipcRenderer.invoke("inventory:get"),
  updateStock: (payload) => ipcRenderer.invoke("inventory:updateStock", payload),

  // TICKETS
  createTicket: (total) => ipcRenderer.invoke("tickets:create", total),
  addTicketItem: (item) => ipcRenderer.invoke("tickets:addItem", item),

  // EXPENSES
  addExpense: (data) => ipcRenderer.invoke("expenses:add", data),
  getExpenses: () => ipcRenderer.invoke("expenses:getAll"),
};

contextBridge.exposeInMainWorld("api", api);
