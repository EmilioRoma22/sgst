import { useQuery } from "@tanstack/react-query"
import { useTallerStore } from "../../auth/stores/taller.store"
import { talleresService } from "../../talleres/services/talleres.service"

export function useNombreTaller() {
  const taller = useTallerStore((s) => s.taller)

  const { data: respuestaTaller } = useQuery({
    queryKey: ["taller", taller?.id_taller],
    queryFn: async () => {
      if (!taller?.id_taller) return null
      const { data } = await talleresService.obtenerPorId(taller.id_taller)
      return data
    },
    enabled: !!taller?.id_taller,
  })

  return respuestaTaller?.nombre_taller || "Taller"
}
