import { ipcRenderer, contextBridge } from 'electron'

// API Expuesta
const api = {
  // Productos
  getProducts: () => ipcRenderer.invoke('products:getAll'),
  addProduct: (data: any) => ipcRenderer.invoke('products:add', data),
  deleteProduct: (id: number) => ipcRenderer.invoke('products:delete', id),

  // Inventario
  getInventory: () => ipcRenderer.invoke('inventory:get'),
  updateStock: (payload: any) => ipcRenderer.invoke('inventory:updateStock', payload),

 // Tickets
  createTicket: (total: number) => ipcRenderer.invoke('tickets:create', total),
  addTicketItem: (item: any) => ipcRenderer.invoke('tickets:addItem', item),
  getTicketItems: (ticketId: number) => ipcRenderer.invoke('tickets:getItems', ticketId), // <-- NUEVO
  closeTicket: (ticket_id: number) => ipcRenderer.invoke('tickets:close', ticket_id),

  // Gastos
  addExpense: (data: any) => ipcRenderer.invoke('expenses:add', data),
  getExpenses: () => ipcRenderer.invoke('expenses:getAll'),

  // Reportes
  getDailyStats: () => ipcRenderer.invoke('reports:getDailyStats'),
  getSalesHistory: () => ipcRenderer.invoke('reports:getSalesHistory'),
}

contextBridge.exposeInMainWorld('api', api)