import { useEffect, useState } from "react";
import { CashRegisterOpening } from "@/types/cashregister";

export function useFetchCashRegisterOpenings() {
  const [data, setData] = useState<CashRegisterOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/cash-register/openings")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`Error al cargar aperturas de caja: ${err.message}`);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
