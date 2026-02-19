import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { clientesService } from "../services/clientes.service"
import type { CrearClienteDTO } from "../types/cliente.types"
import type { ErrorApi } from "../../auth/types/auth.types"
import { mostrarToast } from "../../../helpers/toast"
import { CLIENTES_QUERY_KEY } from "./useClientes"

export function useCrearCliente() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (datos: CrearClienteDTO) => clientesService.crear(datos),
    onSuccess: (respuesta) => {
      mostrarToast.success(respuesta.data.message)
      queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY })
    },
    onError: (error: AxiosError<ErrorApi>) => {
      const mensaje =
        error.response?.data?.error?.message || "Error al crear el cliente"
      mostrarToast.error(mensaje)
    },
  })
}
