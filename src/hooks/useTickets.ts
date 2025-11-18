import { useState } from "react";
import { TicketsAPI } from "../api/tickets";

export function useTickets() {
  const [ticketId, setTicketId] = useState<number | null>(null);

  const create = async (total: number) => {
    const id = await TicketsAPI.create(total);
    setTicketId(id);
    return id;
  };

  const addItem = async (item) => {
    await TicketsAPI.addItem(item);
  };

  return { ticketId, create, addItem };
}
