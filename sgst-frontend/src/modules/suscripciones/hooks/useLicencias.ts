import { useQuery } from "@tanstack/react-query"
import { suscripcionesService } from "../services/suscripciones.service"

export const LICENCIAS_QUERY_KEY = ["suscripciones", "licencias"]

export function useLicencias() {
  return useQuery({
    queryKey: LICENCIAS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await suscripcionesService.listarLicencias()
      return data
    },
  })
}
