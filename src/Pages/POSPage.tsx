import { usePOS } from "../hooks/usePOS";

export default function POSPage() {
  const { ticket, total, addProduct, removeProduct } = usePOS();

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      
      {/* Lista de productos */}
      <section className="col-span-2 bg-gray-800 p-4 rounded-lg overflow-auto">
        <h2 className="text-xl font-bold mb-4">Productos</h2>

        <div className="grid grid-cols-4 gap-4">
          {["Cerveza", "Michelada", "Caribe", "Paloma"].map((x, idx) => (
            <button
              key={idx}
              onClick={() => addProduct({ name: x })}
              className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600"
            >
              {x}
            </button>
          ))}
        </div>
      </section>

      {/* Ticket */}
      <section className="bg-gray-800 p-4 rounded-lg flex flex-col">
        <h2 className="text-xl font-bold mb-3">Ticket</h2>

        <div className="flex-1 overflow-auto space-y-3">
          {ticket.length === 0 && (
            <p className="opacity-50">Aún no hay productos</p>
          )}

          {ticket.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between bg-gray-700 p-3 rounded"
            >
              <span>{item.name}</span>
              <button
                onClick={() => removeProduct(item.id)}
                className="text-red-400 hover:text-red-300"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-gray-900 p-4 rounded-lg">
          <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
          <button className="w-full mt-3 bg-green-600 py-2 rounded-lg hover:bg-green-500">
            Cobrar
          </button>
        </div>
      </section>

    </div>
  );
}
