export const InventoryAPI = {
  get: () => window.api.getInventory(),
  updateStock: (payload) => window.api.updateStock(payload),
};
