import { create } from "zustand"
import { Patient } from "@/types"
import { Order, OrderItem } from "@/types/reception"



export interface PayloadToSave {
  patient: {
    id: string;
    full_name: string;
  }
}

  interface ReceptionState {
    patient: Patient | null;
    orders: Order | null;
    setPatient: (p: Patient | null) => void;
    addOrderItem: (item: OrderItem) => void;
    updateOrderItem: (item: OrderItem) => void;
    removeOrderItem: (itemId: number) => void;
    reset: () => void;
  }
//   orders: Order | null;
//   setPatient: (p: { id: string; full_name: string } | null) => void;
//   addOrderItem: (item: OrderItem) => void;
//   updateOrderItem: (item: OrderItem) => void;
//     setPatient: (p) => set({ patient: p }),
//   reset: () => void;
// }


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
