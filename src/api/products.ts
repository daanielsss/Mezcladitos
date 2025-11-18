export const ProductsAPI = {
  getAll: () => window.api.getProducts(),
  add: (data) => window.api.addProduct(data),
  delete: (id) => window.api.deleteProduct(id),
};
