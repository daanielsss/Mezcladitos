import { useEffect, useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { Product } from "../types/Product";

export default function InventoryPage() {
  const { getProducts } = useInventory();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inventario</h2>

      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-2 text-left">Producto</th>
            <th className="p-2">Precio</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Categoría</th>
          </tr>
        </thead>

        <tbody>
          {products?.map(p => (
            <tr key={p.id} className="border-b border-gray-700">
              <td className="p-2">{p.name}</td>
              <td className="p-2">${p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 opacity-70">{p.category}</td>
            </tr>
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center opacity-50">
                No hay productos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
