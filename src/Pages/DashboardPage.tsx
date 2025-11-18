export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-4 gap-4">
        <Card title="Ventas del día" value="$0.00" />
        <Card title="Tickets generados" value="0" />
        <Card title="Productos bajos en stock" value="0" />
        <Card title="Gastos del día" value="$0.00" />
      </div>

      <section className="bg-gray-800 p-4 rounded-lg h-80 flex items-center justify-center opacity-50">
        <span>Gráfica de ventas (pendiente de integrar)</span>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <p className="opacity-70">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}
