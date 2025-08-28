import { create } from "zustand"

type Patient = {
  id?: number
  full_name: string
  document?: string
  dob?: string
  phone?: string
  seguro_id?: number
  seguro_name?: string
}

type Professional = {
  id: number
  name: string
  last_name: string
  full_name: string
}

type Seguro = {
  id: number
  name: string
}

type ServiceItem = {
  id: number
  name: string
  price_sale: number
  qty: number
  discount: number
  seguro_id: number
  seguro_name: string
}


interface ReceptionState {
  patient: Patient | null
  professional: Professional | null
  seguro: Seguro | null
  cart: ServiceItem[]
  setPatient: (p: Patient | null) => void
  setProfessional: (p: Professional | null) => void
  setSeguro: (s: Seguro | null) => void
  addService: (s: ServiceItem, seguro_id?: number) => void
  updateQty: (id: number, qty: number) => void
  updateDiscount: (id: number, discount: number) => void
  updateItemSeguro: (id: number, seguro_id: number) => void
  removeService: (id: number) => void
  reset: () => void
}

export const useReceptionStore = create<ReceptionState>((set) => ({
  patient: null,
  professional: null,
  seguro: null,
  cart: [],
  setPatient: (p) =>
    set(() => ({
      patient: p,
      seguro: p?.seguro_id ? { id: p.seguro_id, name: p.seguro_name ?? "Seguro" } : null,
    })),
  setProfessional: (p) => set({ professional: p }),
  setSeguro: (s) => set({ seguro: s }),
  addService: (s) =>
  set((state) => {
    const exists = state.cart.find((i) => i.id === s.id && i.seguro_id === s.seguro_id)
    if (exists) {
      return {
        cart: state.cart.map((i) =>
          i.id === s.id && i.seguro_id === s.seguro_id
            ? { ...i, qty: i.qty + 1 }
            : i
        ),
      }
    }
    return { cart: [...state.cart, { ...s, qty: 1, discount: 0 }] }
  }),

  updateQty: (id, qty) =>
    set((state) => ({
      cart: state.cart.map((i) => (i.id === id ? { ...i, qty } : i)),
    })),
  updateDiscount: (id, discount) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id ? { ...i, discount } : i
      ),
    })),
  updateItemSeguro: (id, seguro_id) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id ? { ...i, seguro_id } : i
      ),
    })),
  removeService: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    })),
  reset: () => set({ patient: null, professional: null, seguro: null, cart: [] }),
}))
