import { Navigate, Outlet } from "react-router-dom"
import { useVerificarSesion } from "../../modules/auth/hooks/useVerificarSesion"
import { useUsuarioStore } from "../../modules/auth/stores/usuario.store"
import { useTallerStore } from "../../modules/auth/stores/taller.store"
import PantallaCarga from "../ui/PantallaCarga"

function RutaPublica() {
  const { cargando, autenticado } = useVerificarSesion()
  const usuario = useUsuarioStore((s) => s.usuario)
  const taller = useTallerStore((s) => s.taller)

  if (cargando) return <PantallaCarga />

  if (autenticado && usuario) {
    if (taller) return <Navigate to="/dashboard" replace />
    if (!usuario.id_empresa) return <Navigate to="/empresa/crear" replace />
    return <Navigate to="/suscripciones" replace />
  }

  return <Outlet />
}

export default RutaPublica
