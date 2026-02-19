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
    // Si tiene taller seleccionado, ir al dashboard
    if (taller) return <Navigate to="/dashboard" replace />
    
    // Si es administrador (tiene id_empresa) pero no tiene taller, ir a talleres
    if (usuario.id_empresa) return <Navigate to="/dashboard/talleres" replace />
    
    // Si no tiene empresa, ir a crear empresa
    return <Navigate to="/empresa/crear" replace />
  }

  return <Outlet />
}

export default RutaPublica
