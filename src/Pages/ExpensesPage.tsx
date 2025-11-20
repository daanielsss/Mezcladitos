import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';

export default function ExpensesPage() {
  const { expenses, addExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Insumos');
  const [note, setNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const success = await addExpense({
      amount: parseFloat(amount),
      category,
      note
    });

    if (success) {
      setAmount('');
      setNote('');
      alert('Gasto registrado');
    }
  };

  return (
    <div className="p-6 h-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulario de Registro */}
      <div className="bg-gray-800 p-6 rounded-xl h-fit">
        <h2 className="text-2xl font-bold text-white mb-6">Registrar Gasto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Monto ($)</label>
            <input 
              type="number" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xl"
              placeholder="0.00"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Categoría</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
            >
              <option>Insumos</option>
              <option>Proveedores</option>
              <option>Servicios</option>
              <option>Personal</option>
              <option>Mantenimiento</option>
              <option>Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Nota (Opcional)</label>
            <textarea 
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none h-24 resize-none"
              placeholder="Detalles del gasto..."
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold p-4 rounded-lg transition mt-4"
          >
            Registrar Salida
          </button>
        </form>
      </div>

      {/* Historial de Gastos */}
      <div className="bg-gray-800 p-6 rounded-xl flex flex-col h-full overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-4">Últimos Movimientos</h2>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
          {expenses.map((exp) => (
            <div key={exp.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center border-l-4 border-red-500">
              <div>
                <div className="text-white font-bold text-lg">{exp.category}</div>
                <div className="text-gray-400 text-sm">{exp.note || 'Sin nota'}</div>
                <div className="text-gray-500 text-xs mt-1">{exp.datetime}</div>
              </div>
              <div className="text-red-400 font-bold text-xl">
                -${exp.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
