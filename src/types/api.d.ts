export interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface InventoryItem {
  id: number;
  product_id: number;
  stock: number;
  unit: string;
}

export interface TicketItem {
  ticket_id: number;
  product_id: number;
  qty: number;
  subtotal: number;
}

export interface Expense {
  id?: number;
  description: string;
  amount: number;
  created_at?: string;
}
