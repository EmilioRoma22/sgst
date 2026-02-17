import { create } from "zustand"
import type { UsuarioMe } from "../types/auth.types"

interface EstadoUsuario {
  usuario: UsuarioMe | null
  setUsuario: (usuario: UsuarioMe) => void
  clearUsuario: () => void
}

export const useUsuarioStore = create<EstadoUsuario>()((set) => ({
  usuario: null,
  setUsuario: (usuario) => set({ usuario }),
  clearUsuario: () => set({ usuario: null }),
}))
