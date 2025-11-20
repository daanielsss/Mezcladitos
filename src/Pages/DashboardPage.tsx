import { useEffect, useState } from "react";
import { ReportsAPI } from "../api/reports";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    salesTotal: 0,
    salesCount: 0,
    lowStockCount: 0,
    expensesTotal: 0
  });

  useEffect(() => {
    loadStats();
    // Opcional: Recargar cada vez que se entra a la pantalla
  }, []);

  const loadStats = async () => {
    try {
      const data = await ReportsAPI.getDailyStats();
      setStats(data);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    }
  };

  // Calcular ganancia neta simple (Ventas - Gastos)
  const netIncome = stats.salesTotal - stats.expensesTotal;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <button onClick={loadStats} className="text-sm text-blue-400 hover:underline">
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          title="Ventas del día" 
          value={`$${stats.salesTotal.toFixed(2)}`} 
          color="text-green-400"
        />
        <Card 
          title="Tickets Cerrados" 
          value={stats.salesCount.toString()} 
          color="text-white"
        />
        <Card 
          title="Gastos del día" 
          value={`$${stats.expensesTotal.toFixed(2)}`} 
          color="text-red-400"
        />
        <Card 
          title="Balance Neto" 
          value={`$${netIncome.toFixed(2)}`} 
          color={netIncome >= 0 ? "text-blue-400" : "text-red-500"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerta de Stock */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Estado de Inventario</h3>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${stats.lowStockCount > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
              {stats.lowStockCount}
            </div>
            <p className="text-gray-400">
              Productos con stock bajo (menos de 10 unidades).
              {stats.lowStockCount > 0 && " ¡Revisa el inventario!"}
            </p>
          </div>
        </div>

        {/* Placeholder para Gráfica */}
        <section className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-center items-center opacity-50 h-40">
          <span className="text-4xl mb-2">📊</span>
          <span>Gráfica de ventas semanal (Próximamente)</span>
        </section>
      </div>
    </div>
  );
}

function Card({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
      <h3 className={`text-3xl font-bold ${color}`}>{value}</h3>
    </div>
  );
}
