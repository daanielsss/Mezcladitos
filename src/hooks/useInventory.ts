import { useEffect, useState } from "react";
import { InventoryAPI } from "../api/inventory";

export function useInventory() {
  const [items, setItems] = useState([]);

  const load = async () => {
    setItems(await InventoryAPI.get());
  };

  const updateStock = async (payload) => {
    await InventoryAPI.updateStock(payload);
    load();
  };

  useEffect(() => load(), []);

  return { items, updateStock, reload: load };
}
