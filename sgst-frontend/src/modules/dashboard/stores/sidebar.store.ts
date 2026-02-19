import { create } from "zustand"

interface EstadoSidebar {
  colapsado: boolean
  setColapsado: (colapsado: boolean) => void
  toggleColapsado: () => void
}

export const useSidebarStore = create<EstadoSidebar>()((set) => ({
  colapsado: false,
  setColapsado: (colapsado) => set({ colapsado }),
  toggleColapsado: () => set((state) => ({ colapsado: !state.colapsado })),
}))
