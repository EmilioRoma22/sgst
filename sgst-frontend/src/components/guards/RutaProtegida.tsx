import { Navigate, Outlet } from "react-router-dom"
import { useVerificarSesion } from "../../modules/auth/hooks/useVerificarSesion"
import PantallaCarga from "../ui/PantallaCarga"

function RutaProtegida() {
  const { cargando, autenticado } = useVerificarSesion()

  if (cargando) return <PantallaCarga />
  if (!autenticado) return <Navigate to="/login" replace />

  return <Outlet />
}

export default RutaProtegida
