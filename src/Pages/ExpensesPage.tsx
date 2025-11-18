import { useEffect, useState } from "react";
import { useExpenses } from "../hooks/useExpenses";
import { Expense } from "../types/Expense";

export default function ExpensesPage() {
  const { getExpenses, addExpense } = useExpenses();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getExpenses();
    setExpenses(res);
  }

  async function save() {
    if (!amount || !category) return;

    await addExpense({
      amount: Number(amount),
      category,
      datetime: new Date().toISOString(),
    });

    setAmount("");
    setCategory("");
    load();
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gastos</h2>

      <div className="flex gap-4 mb-6">
        <input
          className="bg-gray-700 p-2 rounded-lg"
          placeholder="Monto"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <input
          className="bg-gray-700 p-2 rounded-lg"
          placeholder="Categoría"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <button
          onClick={save}
          className="bg-blue-600 px-4 rounded-lg hover:bg-blue-500"
        >
          Guardar
        </button>
      </div>

      <table className="w-full bg-gray-800 rounded-lg">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-2">Fecha</th>
            <th className="p-2">Monto</th>
            <th className="p-2">Categoría</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map(e => (
            <tr key={e.id} className="border-b border-gray-700">
              <td className="p-2 opacity-70">{new Date(e.datetime).toLocaleString()}</td>
              <td className="p-2">${e.amount}</td>
              <td className="p-2">{e.category}</td>
            </tr>
          ))}

          {expenses.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center opacity-50">
                No hay gastos registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
