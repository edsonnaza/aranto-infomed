 interface Sede {
  id: number;
  company_name: string;
  application_name: string;
  app_description: string;
  phone_number: string;
  email: string;
  city: string;
  logo: string;
  ruc: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface SedeData {
  id: number;
  company_name: string;
  application_name: string;
  app_description: string;
  phone_number: string;
  email: string;
  city: string;
  logo: string;
  ruc: string;
  address: string;
}

interface UseSedeDataReturn {
  sede: SedeData | null;
  loading: boolean;
  error: Error | null;
}

export type { UseSedeDataReturn, Sede, SedeData };
