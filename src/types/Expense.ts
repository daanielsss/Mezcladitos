export interface Expense {
  id: number;
  datetime: string;
  amount: number;
  category: string;
  description?: string;
}
