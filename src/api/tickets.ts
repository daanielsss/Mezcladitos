export const TicketsAPI = {
  create: (total: number) => window.api.createTicket(total),
  addItem: (item) => window.api.addTicketItem(item),
};
