import { useState, useEffect } from "react";
import { TicketsAPI } from "../api/tickets";

export interface ActiveTicket {
  id: number; // ID real de la BD
  label: string; // "Cliente 01"
}

export function useActiveTickets() {
  // Estado inicial: lista vacía o cargar de localStorage si quisiéramos persistencia local
  const [tickets, setTickets] = useState<ActiveTicket[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);

  // Al iniciar, si no hay tickets, creamos el primero automáticamente? 
  // Mejor dejamos que el usuario lo cree o creamos uno por defecto.
  
  const createTicket = async () => {
    // 1. Crear en BD
    const res = await TicketsAPI.create(0);
    const newId = res.id;

    // 2. Agregar a la lista local
    const newTicket = { 
      id: newId, 
      label: `Cliente ${String(newId).padStart(2, '0')}` 
    };
    
    setTickets(prev => [...prev, newTicket]);
    setActiveTicketId(newId);
  };

  const closeTicket = async (id: number) => {
    // 1. Cerrar en BD (lo haremos al cobrar, pero aquí quitamos la pestaña)
    // await TicketsAPI.close(id); // Opcional: si cancelar significa borrar
    
    const newTickets = tickets.filter(t => t.id !== id);
    setTickets(newTickets);

    if (activeTicketId === id) {
      // Si cerramos el activo, cambiar al último disponible o null
      setActiveTicketId(newTickets.length > 0 ? newTickets[newTickets.length - 1].id : null);
    }
  };

  return {
    tickets,
    activeTicketId,
    setActiveTicketId,
    createTicket,
    closeTicket
  };
}