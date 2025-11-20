import { Product } from "../types/Product";

interface Props {
  products: Product[];
  onAdd: (p: Product) => void;
}

export default function ProductGrid({ products, onAdd }: Props) {
  return (
    <div style={{ padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "14px" }}>
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => onAdd(p)}
          disabled={p.stock <= 0}
          style={{
            background: "#242838",
            border: "none",
            borderRadius: "12px",
            padding: "12px",
            height: "160px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            cursor: p.stock > 0 ? "pointer" : "not-allowed",
            opacity: p.stock > 0 ? 1 : 0.5,
            textAlign: "left",
            color: "white"
          }}
        >
          {/* Placeholder de imagen */}
          <div style={{ height: "80px", background: "#1f2230", borderRadius: "8px", marginBottom: "8px" }}>
            {p.image && <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />}
          </div>
          
          <div>
            <div style={{ fontWeight: "bold", fontSize: "15px" }}>{p.name}</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ color: "#4ade80" }}>${p.price}</span>
              <span style={{ fontSize: "12px", opacity: 0.7 }}>Stock: {p.stock}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
