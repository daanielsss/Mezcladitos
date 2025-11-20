import { usePOS } from "../hooks/usePOS";

export default function POSPage() {
  const { products, ticketItems, total, addProduct, removeProduct } = usePOS();

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      
      {/* Lista de productos */}
      <section className="col-span-2 bg-gray-800 p-4 rounded-lg overflow-auto">
        <h2 className="text-xl font-bold mb-4">Productos ({products.length})</h2>

        {/* Grid de productos reales de la BD */}
        <div className="grid grid-cols-4 gap-4">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => addProduct(p)}
              disabled={p.stock <= 0} // Deshabilita si no hay stock
              className={`p-4 rounded-lg transition ${
                p.stock > 0
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-red-900 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm opacity-70">${p.price.toFixed(2)}</div>
              {p.stock <= 5 && p.stock > 0 && (
                <div className="text-yellow-400 text-xs mt-1">
                  ¡Solo {p.stock} en stock!
                </div>
              )}
              {p.stock <= 0 && (
                <div className="text-red-400 text-xs mt-1">AGOTADO</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Ticket */}
      <section className="bg-gray-800 p-4 rounded-lg flex flex-col">
        <h2 className="text-xl font-bold mb-3">Ticket</h2>

        <div className="flex-1 overflow-auto space-y-3">
          {ticketItems.length === 0 && (
            <p className="opacity-50">Aún no hay productos</p>
          )}

          {ticketItems.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-gray-700 p-3 rounded"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{item.name}</span>
                <span className="text-xs opacity-70">
                  {item.qty} x ${item.price.toFixed(2)} = ${item.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-2">
                 <button
                  onClick={() => addProduct(products.find(p => p.id === item.id)!)}
                  className="bg-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-500"
                >
                  +
                </button>
                <button
                  onClick={() => removeProduct(item.id)}
                  className="bg-red-600 px-2 py-1 rounded text-sm hover:bg-red-500"
                >
                
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-gray-900 p-4 rounded-lg">
          <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
          <button 
            disabled={ticketItems.length === 0}
            className={`w-full mt-3 py-2 rounded-lg ${
              ticketItems.length > 0 ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
          >
            Cobrar
          </button>
        </div>
      </section>

    </div>
  );
}
