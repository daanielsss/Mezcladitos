import { useEffect } from "react";
import Layout from "../pos/Layout"; // OJO: Verifica si vas a usar el Layout wrapper o divs directos
import TopBar from "../pos/TopBar";
import ProductGrid from "../pos/ProductGrid";
import TicketPanel from "../pos/TicketPanel"; // Asegúrate de actualizar este también para recibir props
import ActionsPanel from "../pos/ActionsPanel";
import { useProducts } from "../hooks/useProducts";
import { useActiveTickets } from "../hooks/useActiveTickets";
import { usePOS } from "../hooks/usePOS";
import { TicketsAPI } from "../api/tickets";

export default function POSPage() {
  const { products, reload: reloadProducts } = useProducts();
  const { tickets, activeTicketId, setActiveTicketId, createTicket, closeTicket } = useActiveTickets();
  const { items, total, addItem, refreshTicket } = usePOS(activeTicketId);

  // Cargar un ticket inicial si no hay
  useEffect(() => {
    if (tickets.length === 0) {
      createTicket();
    }
  }, []);

  const handleCheckout = async () => {
    if (!activeTicketId) return;
    
    const confirm = window.confirm(`¿Cobrar total de $${total}?`);
    if (confirm) {
      await TicketsAPI.close(activeTicketId);
      closeTicket(activeTicketId);
      // Actualizar inventario visualmente
      reloadProducts();
    }
  };

  return (
    <div className="pos-container">
      <TopBar 
        tickets={tickets} 
        activeId={activeTicketId} 
        onSelect={setActiveTicketId} 
        onCreate={createTicket} 
      />

      <div className="pos-body">
        <div className="left-panel">
          <ProductGrid products={products} onAdd={addItem} />
        </div>

        <div className="center-panel">
          {/* Necesitas actualizar TicketPanel para aceptar items y total */}
          <TicketPanel items={items} total={total} /> 
        </div>

        <div className="right-panel">
          <ActionsPanel onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  );
}
