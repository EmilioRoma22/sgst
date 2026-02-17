import { useQuery } from "@tanstack/react-query"
import { suscripcionesService } from "../services/suscripciones.service"
import { verificacionSuscripcionSchema } from "../schemas/suscripciones.schemas"

export const VERIFICAR_SUSCRIPCION_QUERY_KEY = ["suscripciones", "verificar"]

export function useVerificarSuscripcion() {
  return useQuery({
    queryKey: VERIFICAR_SUSCRIPCION_QUERY_KEY,
    queryFn: async () => {
      const { data } = await suscripcionesService.verificar()
      const resultado = verificacionSuscripcionSchema.safeParse(data)
      if (!resultado.success) {
        throw new Error("Respuesta de verificación de suscripción inválida")
      }
      return resultado.data
    },
  })
}
