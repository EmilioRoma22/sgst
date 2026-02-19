import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/auth.service"
import { useUsuarioStore } from "../stores/usuario.store"
import { useTallerStore } from "../stores/taller.store"
import { mostrarToast } from "../../../helpers/toast"

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export function useCerrarSesion() {
  const navigate = useNavigate()
  const usuario = useUsuarioStore((s) => s.usuario)
  const clearUsuario = useUsuarioStore((s) => s.clearUsuario)
  const clearTaller = useTallerStore((s) => s.clearTaller)

  return useMutation({
    mutationFn: async () => {
      const esAdministrador = usuario?.id_empresa !== null && usuario?.id_empresa !== undefined
      const tieneTallerCookie = getCookie("id_taller_actual") !== null
      
      await authService.cerrarSesion()
      return ({
        esAdministrador,
        tieneTallerCookie,
      })
    },
    onSuccess: async (contexto) => {
      // El backend elimina tokens en estos casos:
      // 1. Usuario NO es administrador (id_empresa is None)
      // 2. Usuario ES administrador pero NO tiene taller activo (id_taller_cookie is None)
      // 
      // El backend NO elimina tokens cuando:
      // - Usuario ES administrador Y tiene taller activo (solo elimina cookie del taller)
      
      const { esAdministrador, tieneTallerCookie } = contexto

      // Si es administrador y tenía cookie de taller, el backend NO eliminó los tokens
      // Solo eliminó la cookie del taller, así que limpiamos el store y vamos a talleres
      if (esAdministrador && tieneTallerCookie) {
        clearTaller()
        navigate("/dashboard/talleres", { replace: true })
        mostrarToast.success("Sesión cerrada correctamente")
        return
      }

      // En cualquier otro caso, el backend eliminó los tokens
      // Limpiamos todo y vamos al login
      clearUsuario()
      clearTaller()
      mostrarToast.success("Sesión cerrada correctamente")
      navigate("/login", { replace: true })
    },
    onError: () => {
      clearUsuario()
      clearTaller()
      mostrarToast.error("Error al cerrar sesión")
      navigate("/login", { replace: true })
    },
  })
}
