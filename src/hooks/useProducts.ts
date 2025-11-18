import { useEffect, useState } from "react";
import { ProductsAPI } from "../api/products";

export function useProducts() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const data = await ProductsAPI.getAll();
    setProducts(data);
  };

  const add = async (product) => {
    await ProductsAPI.add(product);
    load();
  };

  const remove = async (id) => {
    await ProductsAPI.delete(id);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return { products, add, remove, reload: load };
}
