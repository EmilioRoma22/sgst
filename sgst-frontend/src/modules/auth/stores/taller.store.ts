import { create } from "zustand"
import type { TallerMe } from "../types/auth.types"

interface EstadoTaller {
  taller: TallerMe | null
  setTaller: (taller: TallerMe | null) => void
  clearTaller: () => void
}

export const useTallerStore = create<EstadoTaller>()((set) => ({
  taller: null,
  setTaller: (taller) => set({ taller }),
  clearTaller: () => set({ taller: null }),
}))
