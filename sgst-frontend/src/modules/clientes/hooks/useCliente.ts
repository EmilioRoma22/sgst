import { useQuery } from "@tanstack/react-query"
import { clientesService } from "../services/clientes.service"

export function useCliente(id_cliente: number | null) {
  return useQuery({
    queryKey: ["cliente", id_cliente],
    queryFn: async () => {
      if (!id_cliente) return null
      const { data } = await clientesService.obtenerPorId(id_cliente)
      return data
    },
    enabled: !!id_cliente,
  })
}
