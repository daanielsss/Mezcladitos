import { useEffect, useState } from "react";
import { ReportsAPI } from "../api/reports";

interface SaleRecord {
  id: number;
  total: number;
  closed_at: string;
}

export default function ReportsPage() {
  const [history, setHistory] = useState<SaleRecord[]>([]);

  useEffect(() => {
    ReportsAPI.getSalesHistory().then(setHistory);
  }, []);

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-white mb-6">Historial de Ventas</h2>
      
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex-1">
        <div className="overflow-y-auto h-full custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-gray-400 uppercase text-xs sticky top-0">
              <tr>
                <th className="p-4">Ticket ID</th>
                <th className="p-4">Fecha / Hora</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-gray-300 divide-y divide-gray-700">
              {history.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-700/50 transition">
                  <td className="p-4 font-mono">#{sale.id.toString().padStart(4, '0')}</td>
                  <td className="p-4">{new Date(sale.closed_at).toLocaleString()}</td>
                  <td className="p-4 text-right font-bold text-green-400">
                    ${sale.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay ventas registradas aún.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
