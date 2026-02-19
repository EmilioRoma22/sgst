import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { clientesService } from "../services/clientes.service"
import type { ErrorApi } from "../../auth/types/auth.types"
import { mostrarToast } from "../../../helpers/toast"
import { CLIENTES_QUERY_KEY } from "./useClientes"

export function useEliminarCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id_cliente: number) => clientesService.eliminar(id_cliente),
    onSuccess: (respuesta) => {
      mostrarToast.success(respuesta.data.message)
      queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY })
    },
    onError: (error: AxiosError<ErrorApi>) => {
      const mensaje =
        error.response?.data?.error?.message || "Error al eliminar el cliente"
      mostrarToast.error(mensaje)
    },
  })
}
