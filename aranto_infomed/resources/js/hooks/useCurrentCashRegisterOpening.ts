import { useEffect, useState } from 'react';
import { CashRegisterOpening } from '@/types/cashregister';

export function useCurrentCashRegisterOpening() {
  const [opening, setOpening] = useState<CashRegisterOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/cash-register/current')
      .then(res => res.json())
      .then(data => {
        setOpening(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al obtener apertura de caja actual');
        setLoading(false);
      });
  }, []);

  return { opening, loading, error };
}
