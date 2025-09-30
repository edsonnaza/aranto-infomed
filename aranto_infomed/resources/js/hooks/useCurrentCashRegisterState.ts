import { useEffect } from "react";
import { useCashRegisterStore } from "@/stores/useCashRegisterStore";
import { CashRegisterOpening } from "@/types/cashregister";

export function useCurrentCashRegisterState(userId: number) {
  const setCashRegisterState = useCashRegisterStore(state => state.setCashRegisterState);

  useEffect(() => {
    fetch("/cash-register/current")
      .then(res => res.json())
      .then((data: CashRegisterOpening | null) => {
        setCashRegisterState({
          hasOpenCashRegister: !!data,
          openCashRegister: data,
          isCashier: !!data && data.cashier?.id === userId,
        });
      })
      .catch(() => setCashRegisterState({ hasOpenCashRegister: false, openCashRegister: null, isCashier: false }));
  }, [setCashRegisterState, userId]);
}
