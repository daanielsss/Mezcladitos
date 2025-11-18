import { useEffect, useState } from "react";
import { ExpensesAPI } from "../api/expenses";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);

  const load = async () => {
    setExpenses(await ExpensesAPI.getAll());
  };

  const add = async (data) => {
    await ExpensesAPI.add(data);
    load();
  };

  useEffect(() => load(), []);

  return { expenses, add };
}
