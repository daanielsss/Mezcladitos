export default function TopBar() {
  return (
    <div style={{
      height: "60px",
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      background: "#181b27",
      borderBottom: "1px solid #1f2230",
      overflowX: "auto",
      gap: "12px"
    }}>
      <button className="client-tab selected">Cliente 01</button>
      <button className="client-tab">Cliente 02</button>
      <button className="client-tab">Cliente 03</button>
      <button className="client-tab add">+ Nuevo Cliente</button>
    </div>
  );
}
