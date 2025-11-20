import { useState, useEffect } from "react";
import { ProductsAPI } from "../api/products";
import { TicketsAPI } from "../api/tickets";
import { Product } from "../types/Product";

// Define un Item de Ticket más rico para el frontend
interface POSItem {
  id: number; // product id
  name: string;
  price: number;
  qty: number;
  subtotal: number;
}

export function usePOS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [ticketItems, setTicketItems] = useState<POSItem[]>([]);
  const [total, setTotal] = useState(0);

  // 1. Cargar la lista de productos disponibles al inicio
  useEffect(() => {
    ProductsAPI.getAll().then(setProducts);
  }, []);

  // 2. Calcular el total del ticket cada vez que los items cambian
  useEffect(() => {
    const newTotal = ticketItems.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(newTotal);
  }, [ticketItems]);

  // Función de ayuda para encontrar un item en el ticket
  const findItemIndex = (id: number) =>
    ticketItems.findIndex((item) => item.id === id);

  /**
   * Agrega un producto al ticket activo (o crea uno nuevo si no existe)
   */
  async function addProduct(product: Product) {
    if (product.stock <= 0) {
      console.warn(`⚠️ Producto agotado: ${product.name}`);
      return;
    }

    let currentTicketId = ticketId;
    if (!currentTicketId) {
      // Si no hay ticket, crea uno nuevo.
      const result = await TicketsAPI.create(0);
      currentTicketId = result.id;
      setTicketId(currentTicketId);
      console.log(`🎫 Nuevo ticket creado: ${currentTicketId}`);
    }

    // Lógica para manejar el estado local del ticket
    const existingIndex = findItemIndex(product.id);
    const itemPrice = product.price;

    const newItem: POSItem = {
      id: product.id,
      name: product.name,
      price: itemPrice,
      qty: 1,
      subtotal: itemPrice,
    };

    if (existingIndex > -1) {
      // El producto ya existe en el ticket, actualiza la cantidad localmente.
      setTicketItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
                subtotal: item.price * (item.qty + 1),
              }
            : item
        )
      );
    } else {
      // Es un producto nuevo, agrégalo.
      setTicketItems((prevItems) => [...prevItems, newItem]);
    }

    // Llama al IPC para registrar el ítem, actualizar el total y descontar inventario
    await TicketsAPI.addItem({
      ticket_id: currentTicketId,
      product_id: product.id,
      qty: 1,
      price: product.price,
      subtotal: product.price, // Note: subtotal is calculated in the IPC, but we send it for completeness
    });
    
    // Opcional: Recargar productos para reflejar el cambio de stock
    ProductsAPI.getAll().then(setProducts);
  }

  /**
   * Quita un producto del ticket (disminuye cantidad o elimina)
   */
  function removeProduct(id: number) {
    setTicketItems((prevItems) => {
      const existingIndex = findItemIndex(id);
      if (existingIndex === -1) return prevItems;

      const itemToRemove = prevItems[existingIndex];

      if (itemToRemove.qty > 1) {
        // Disminuir la cantidad
        return prevItems.map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1, subtotal: item.price * (item.qty - 1) }
            : item
        );
      } else {
        // Eliminar completamente
        return prevItems.filter((item) => item.id !== id);
      }
      // NOTA: La lógica de remover/devolver inventario y actualizar DB para remociones rápidas
      // es una función pendiente que se agrega en otra fase. Por ahora, solo se maneja localmente.
    });
  }

  return { 
    products, 
    ticketId, 
    ticketItems, 
    total, 
    addProduct, 
    removeProduct 
  };
}
