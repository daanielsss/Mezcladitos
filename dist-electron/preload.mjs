"use strict";
const electron = require("electron");
const api = {
  // Productos
  getProducts: () => electron.ipcRenderer.invoke("products:getAll"),
  addProduct: (data) => electron.ipcRenderer.invoke("products:add", data),
  deleteProduct: (id) => electron.ipcRenderer.invoke("products:delete", id),
  // Inventario
  getInventory: () => electron.ipcRenderer.invoke("inventory:get"),
  updateStock: (payload) => electron.ipcRenderer.invoke("inventory:updateStock", payload),
  // Tickets
  createTicket: (total) => electron.ipcRenderer.invoke("tickets:create", total),
  addTicketItem: (item) => electron.ipcRenderer.invoke("tickets:addItem", item),
  getTicketItems: (ticketId) => electron.ipcRenderer.invoke("tickets:getItems", ticketId),
  // <-- NUEVO
  closeTicket: (ticket_id) => electron.ipcRenderer.invoke("tickets:close", ticket_id),
  // Gastos
  addExpense: (data) => electron.ipcRenderer.invoke("expenses:add", data),
  getExpenses: () => electron.ipcRenderer.invoke("expenses:getAll")
};
electron.contextBridge.exposeInMainWorld("api", api);
