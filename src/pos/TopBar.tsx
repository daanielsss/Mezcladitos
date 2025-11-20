import React from "react";
import { ActiveTicket } from "../hooks/useActiveTickets";
import "./topbar.css";

interface Props {
  tickets: ActiveTicket[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
}

export default function TopBar({ tickets, activeId, onSelect, onCreate }: Props) {
  return (
    <div className="topbar-container" style={{ 
      height: "60px", display: "flex", alignItems: "center", 
      padding: "0 16px", background: "#181b27", 
      borderBottom: "1px solid #1f2230", gap: "10px", overflowX: "auto" 
    }}>
      {tickets.map(t => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`client-tab ${t.id === activeId ? "selected" : ""}`}
        >
          {t.label}
        </button>
      ))}
      
      <button onClick={onCreate} className="client-tab add">
        + Cliente
      </button>
    </div>
  );
}
