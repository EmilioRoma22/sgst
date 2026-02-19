import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { suscripcionesService } from "../services/suscripciones.service"
import { verificacionSuscripcionSchema } from "../schemas/suscripciones.schemas"
import { getLicenciaPorId, type LicenciaConDetalle } from "../constants/licencias"
import { useUsuarioStore } from "../../auth/stores/usuario.store"
import { useTallerStore } from "../../auth/stores/taller.store"
import { authService } from "../../auth/services/auth.service"

export const VERIFICAR_SUSCRIPCION_QUERY_KEY = ["suscripciones", "verificar"]

export type VerificacionSuscripcionConLicencia = {
  tiene_suscripcion: boolean
  id_licencia: string | null
  licencia: LicenciaConDetalle | null
}

/**
 * Error especial para indicar que se detectó una inconsistencia en la respuesta de verificación.
 * Esto puede indicar manipulación de la respuesta HTTP.
 */
class InconsistenciaVerificacionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "InconsistenciaVerificacionError"
  }
}

export function useVerificarSuscripcion() {
  const navigate = useNavigate()
  const clearUsuario = useUsuarioStore((s) => s.clearUsuario)
  const clearTaller = useTallerStore((s) => s.clearTaller)

  const query = useQuery({
    queryKey: VERIFICAR_SUSCRIPCION_QUERY_KEY,
    queryFn: async (): Promise<VerificacionSuscripcionConLicencia> => {
      const { data } = await suscripcionesService.verificar()
      const resultado = verificacionSuscripcionSchema.safeParse(data)
      if (!resultado.success) {
        throw new Error("Respuesta de verificación de suscripción inválida")
      }
      const { tiene_suscripcion, id_licencia } = resultado.data

      // Validación 1: Si tiene_suscripcion es true, id_licencia no debe ser null
      if (tiene_suscripcion && id_licencia === null) {
        throw new InconsistenciaVerificacionError(
          "Inconsistencia detectada: tiene_suscripcion es true pero id_licencia es null"
        )
      }

      // Validación 2: Si hay id_licencia, debe existir en nuestra constante
      if (id_licencia !== null) {
        const licencia = getLicenciaPorId(id_licencia)
        if (!licencia) {
          throw new InconsistenciaVerificacionError(
            `Inconsistencia detectada: id_licencia "${id_licencia}" no existe en las licencias válidas`
          )
        }
        return { tiene_suscripcion, id_licencia, licencia }
      }

      // Caso válido: no tiene suscripción y id_licencia es null
      return { tiene_suscripcion, id_licencia: null, licencia: null }
    },
  })

  // Manejar errores de inconsistencia
  useEffect(() => {
    if (query.error && query.error instanceof InconsistenciaVerificacionError) {
      const cerrarSesionYRedirigir = async () => {
        console.warn(
          "Inconsistencia detectada en verificación de suscripción:",
          query.error.message
        )
        try {
          // Intentar cerrar sesión en el backend
          await authService.cerrarSesion()
        } catch {
          // Si falla cerrar sesión, continuar igualmente
        }
        // Limpiar stores locales
        clearUsuario()
        clearTaller()
        // Redirigir al login
        navigate("/login", { replace: true })
      }
      void cerrarSesionYRedirigir()
    }
  }, [query.error, navigate, clearUsuario, clearTaller])

  return query
}
