import { useState, useEffect } from 'react';

export interface Expense {
  id?: number;
  amount: number;
  category: string;
  note: string;
  datetime?: string;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await window.api.getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error cargando gastos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expense: Expense) => {
    try {
      await window.api.addExpense(expense);
      await loadExpenses(); // Recargar lista
      return true;
    } catch (error) {
      console.error("Error guardando gasto:", error);
      return false;
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadExpenses();
  }, []);

  return {
    expenses,
    loading,
    addExpense,
    reload: loadExpenses
  };
}
