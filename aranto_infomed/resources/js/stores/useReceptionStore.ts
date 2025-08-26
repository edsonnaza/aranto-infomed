import { create } from "zustand"

type Patient = {
  id?: number
  name: string
  document?: string
  dob?: string
  phone?: string
}

type Professional = {
  id: number
  name: string
}

type ServiceItem = {
  id: number
  name: string
  price: number
  qty: number
  discount: number
}

interface ReceptionState {
  patient: Patient | null
  professional: Professional | null
  cart: ServiceItem[]
  setPatient: (p: Patient | null) => void
  setProfessional: (p: Professional | null) => void
  addService: (s: ServiceItem) => void
  updateQty: (id: number, qty: number) => void
  updateDiscount: (id: number, discount: number) => void
  removeService: (id: number) => void
  reset: () => void
}

export const useReceptionStore = create<ReceptionState>((set) => ({
  patient: null,
  professional: null,
  cart: [],
  setPatient: (p) => set({ patient: p }),
  setProfessional: (p) => set({ professional: p }),
  addService: (s) =>
    set((state) => {
      const exists = state.cart.find((i) => i.id === s.id)
      if (exists) {
        return {
          cart: state.cart.map((i) =>
            i.id === s.id ? { ...i, qty: i.qty + 1 } : i
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
  removeService: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    })),
  reset: () => set({ patient: null, professional: null, cart: [] }),
}))
