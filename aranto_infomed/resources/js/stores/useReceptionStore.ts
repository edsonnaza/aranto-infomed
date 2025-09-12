import { create } from "zustand"

// Interfaces según la estructura deseada
interface OrderItem {
  id: number;
  service_id: number;
  order_id: number;
  professional: {
    id: string;
    full_name: string;
  };
  service_name: string;
  quantity: number;
  total_price: number;
  unit_price: number;
  total_amount: number;
  status: "pending";
}

interface Order {
  id: number;
  status: "pending";
  total_amount_items: number;
  items: OrderItem[];
}

export interface PayloadToSave {
  patient: {
    id: string;
    full_name: string;
  };
  orders: Order;
}

interface ReceptionState {
  patient: { id: string; full_name: string } | null;
  orders: Order | null;
  setPatient: (p: { id: string; full_name: string } | null) => void;
  addOrderItem: (item: OrderItem) => void;
  updateOrderItem: (item: OrderItem) => void;
  removeOrderItem: (itemId: number) => void;
  reset: () => void;
}


export const useReceptionStore = create<ReceptionState>((set) => ({
  patient: null,
  orders: null,
  setPatient: (p) => set({ patient: p }),
  addOrderItem: (item) =>
    set((state) => {
      let order = state.orders;
      if (!order) {
        order = {
          id: Date.now(), // temporal, reemplazar por id real si es necesario
          status: "pending",
          total_amount_items: item.total_amount,
          items: [item],
        };
      } else {
        order = {
          ...order,
          items: [...order.items, item],
          total_amount_items: order.total_amount_items + item.total_amount,
        };
      }
      return { orders: order };
    }),
  updateOrderItem: (item) =>
    set((state) => {
      if (!state.orders) return {};
      const items = state.orders.items.map((i) => (i.id === item.id ? item : i));
      const total_amount_items = items.reduce((sum, i) => sum + i.total_amount, 0);
      return {
        orders: {
          ...state.orders,
          items,
          total_amount_items,
        },
      };
    }),
  removeOrderItem: (itemId) =>
    set((state) => {
      if (!state.orders) return {};
      const items = state.orders.items.filter((i) => i.id !== itemId);
      const total_amount_items = items.reduce((sum, i) => sum + i.total_amount, 0);
      return {
        orders: {
          ...state.orders,
          items,
          total_amount_items,
        },
      };
    }),
  reset: () => set({ patient: null, orders: null }),
}))
