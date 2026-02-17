import { useQuery } from "@tanstack/react-query"
import { talleresService } from "../services/talleres.service"

export const TALLERES_QUERY_KEY = ["talleres"]

export function useTalleres() {
  return useQuery({
    queryKey: TALLERES_QUERY_KEY,
    queryFn: async () => {
      const { data } = await talleresService.listarPorEmpresa()
      return data
    },
  })
}
