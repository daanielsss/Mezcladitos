export const ExpensesAPI = {
  add: (data) => window.api.addExpense(data),
  getAll: () => window.api.getExpenses(),
};
