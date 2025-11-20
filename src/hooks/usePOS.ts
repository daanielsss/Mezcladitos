import { useState, useEffect, useCallback } from "react";
import { TicketsAPI } from "../api/tickets";
import { Product } from "../types/Product";

// Definimos el tipo local para la UI
export interface POSItem {
  id: number; // ID de la tabla ticket_items o el product_id para referencia
  productId: number;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
}

export function usePOS(ticketId: number | null) {
  const [items, setItems] = useState<POSItem[]>([]);
  const [total, setTotal] = useState(0);

  // Cargar ítems cuando cambia el ticket activo
  const refreshTicket = useCallback(async () => {
    if (!ticketId) {
      setItems([]);
      setTotal(0);
      return;
    }

    // @ts-ignore - getTicketItems no está tipado en window.api aún en tu d.ts
    const data = await window.api.getTicketItems(ticketId);
    
    // Mapear de DB a estructura UI
    const mappedItems = data.map((row: any) => ({
      id: row.id, // ID único del row en ticket_items
      productId: row.product_id,
      name: row.name,
      price: row.price,
      qty: row.qty,
      subtotal: row.subtotal
    }));

    setItems(mappedItems);
    
    const newTotal = mappedItems.reduce((acc: number, curr: POSItem) => acc + curr.subtotal, 0);
    setTotal(newTotal);
  }, [ticketId]);

  useEffect(() => {
    refreshTicket();
  }, [refreshTicket]);

  const addItem = async (product: Product) => {
    if (!ticketId) return alert("Selecciona o crea un cliente primero");
    
    await TicketsAPI.addItem({
      ticket_id: ticketId,
      product_id: product.id,
      qty: 1,
      price: product.price
    });
    
    refreshTicket(); // Recargar desde BD para tener datos frescos
  };

  return { items, total, addItem, refreshTicket };
}
