export interface PendingService {
  order_id: number;
  item_id: number;
  service_name: string;
  professional: string | null;
  patient: string | null;
  status: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string | null;
}
