export interface CashRegisterOpening {
  id: number;
  cashier: {
    id: number;
    full_name: string;
  };
  sede: {
    id: number;
    nombre: string;
  };
  opening_amount: number;
  total_sales: number;
  total_expenses: number;
  total_incomes: number;
  cash_balance: number;
  opened_at: string;
  closed_at: string | null;
  is_open: boolean;
}
