export function usePOS() {
  const ticket = [];
  const total = 0;

  function addProduct(product) {
    console.log("Agregar al ticket:", product);
  }

  function removeProduct(id) {
    console.log("Quitar producto:", id);
  }

  return { ticket, total, addProduct, removeProduct };
}
