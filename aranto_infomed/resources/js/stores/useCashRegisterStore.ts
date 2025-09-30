import { create } from "zustand";
import { CashRegisterOpening } from "@/types/cashregister";

interface CashRegisterState {
  isCashier: boolean;
  hasOpenCashRegister: boolean;
  openCashRegister: CashRegisterOpening | null;
  setCashRegisterState: (state: Partial<CashRegisterState>) => void;
  reset: () => void;
}

export const useCashRegisterStore = create<CashRegisterState>((set) => ({
  isCashier: false,
  hasOpenCashRegister: false,
  openCashRegister: null,
  setCashRegisterState: (state) => set(state),
  reset: () => set({ isCashier: false, hasOpenCashRegister: false, openCashRegister: null }),
}));
