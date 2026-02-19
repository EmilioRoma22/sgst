import { useQuery } from "@tanstack/react-query"
import { clientesService } from "../services/clientes.service"

export const CLIENTES_QUERY_KEY = ["clientes"]

interface UseClientesParams {
  page?: number
  limit?: number
  order_by?: string
  order_dir?: "ASC" | "DESC"
  search?: string
}

export function useClientes(params?: UseClientesParams) {
  return useQuery({
    queryKey: [...CLIENTES_QUERY_KEY, params],
    queryFn: async () => {
      const { data } = await clientesService.listar(params)
      return data
    },
  })
}
