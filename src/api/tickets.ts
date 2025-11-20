export const TicketsAPI = {
  create: (total: number) => window.api.createTicket(total),
  addItem: (item: any) => window.api.addTicketItem(item),
  getItems: (ticketId: number) => window.api.getTicketItems(ticketId), // <-- FALTABA
  close: (ticketId: number) => window.api.closeTicket(ticketId),       // <-- FALTABA ESTE CRÍTICO
};
