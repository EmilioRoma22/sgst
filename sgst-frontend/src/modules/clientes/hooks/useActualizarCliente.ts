import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { clientesService } from "../services/clientes.service"
import type { ActualizarClienteDTO } from "../types/cliente.types"
import type { ErrorApi } from "../../auth/types/auth.types"
import { mostrarToast } from "../../../helpers/toast"
import { CLIENTES_QUERY_KEY } from "./useClientes"

export function useActualizarCliente() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id_cliente, datos }: { id_cliente: number; datos: ActualizarClienteDTO }) =>
            clientesService.actualizar(id_cliente, datos),
        onSuccess: (respuesta) => {
            mostrarToast.success(respuesta.data.message)
            queryClient.invalidateQueries({ queryKey: CLIENTES_QUERY_KEY })
        },
        onError: (error: AxiosError<ErrorApi>) => {
            const mensaje =
                error.response?.data?.error?.message || "Error al actualizar el cliente"
            mostrarToast.error(mensaje)
        },
    })
}
