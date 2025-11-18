"use strict";
const electron = require("electron");
const api = {
  // PRODUCTS
  getProducts: () => electron.ipcRenderer.invoke("products:getAll"),
  addProduct: (data) => electron.ipcRenderer.invoke("products:add", data),
  deleteProduct: (id) => electron.ipcRenderer.invoke("products:delete", id),
  // INVENTORY
  getInventory: () => electron.ipcRenderer.invoke("inventory:get"),
  updateStock: (payload) => electron.ipcRenderer.invoke("inventory:updateStock", payload),
  // TICKETS
  createTicket: (total) => electron.ipcRenderer.invoke("tickets:create", total),
  addTicketItem: (item) => electron.ipcRenderer.invoke("tickets:addItem", item),
  // EXPENSES
  addExpense: (data) => electron.ipcRenderer.invoke("expenses:add", data),
  getExpenses: () => electron.ipcRenderer.invoke("expenses:getAll")
};
electron.contextBridge.exposeInMainWorld("api", api);
