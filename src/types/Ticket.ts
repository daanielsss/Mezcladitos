export interface TicketItem {
  productId: number;
  name: string;
  qty: number;
  price: number;
}

export interface Ticket {
  id: number;
  datetime: string;
  total: number;
  items: TicketItem[];
}
