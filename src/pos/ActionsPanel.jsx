export default function ActionsPanel() {
  const actions = [
    "Cobrar", "Gastos", "Inventario",
    "Reportes", "Configuración", "Cancelar Ticket"
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {actions.map((label, i) => (
        <button key={i} style={{
          width: "100%",
          padding: "14px",
          background: "#242838",
          border: "none",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}>
          {label}
        </button>
      ))}
    </div>
  );
}
