export default function ProductGrid() {
  return (
    <div style={{ padding: "16px", display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
      gap: "14px"
    }}>
      {/* Aquí luego cargamos productos desde la BD */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          background: "#1b1e2a",
          padding: "12px",
          borderRadius: "10px",
          height: "150px"
        }}>
          Producto {i+1}
        </div>
      ))}
    </div>
  );
}
