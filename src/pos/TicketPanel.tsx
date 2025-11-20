export default function TicketPanel() {
  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ marginBottom: "16px" }}>Ticket Actual</h2>

      <div style={{
        background: "#1b1e2a",
        borderRadius: "10px",
        padding: "12px",
      }}>
        <p>Lista de productos...</p>
      </div>

      <div style={{ marginTop: "24px", fontSize: "20px" }}>
        Total: $0.00
      </div>
    </div>
  );
}
