import cliente from "../../../api/cliente"
import type {
  ClienteDTO,
  CrearClienteDTO,
  ActualizarClienteDTO,
  RespuestaListaClientes,
  RespuestaCrearCliente,
  RespuestaActualizarCliente,
  RespuestaEliminarCliente,
} from "../types/cliente.types"

interface ParametrosListaClientes {
  page?: number
  limit?: number
  order_by?: string
  order_dir?: "ASC" | "DESC"
  search?: string
}

export const clientesService = {
  listar: (params?: ParametrosListaClientes) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.order_by) queryParams.append("order_by", params.order_by)
    if (params?.order_dir) queryParams.append("order_dir", params.order_dir)
    if (params?.search) queryParams.append("search", params.search)

    const queryString = queryParams.toString()
    const url = `/clientes${queryString ? `?${queryString}` : ""}`
    return cliente.get<RespuestaListaClientes>(url)
  },

  obtenerPorId: (id_cliente: number) =>
    cliente.get<ClienteDTO>(`/clientes/${id_cliente}`),

  crear: (datos: CrearClienteDTO) =>
    cliente.post<RespuestaCrearCliente>("/clientes", datos),

  actualizar: (id_cliente: number, datos: ActualizarClienteDTO) =>
    cliente.put<RespuestaActualizarCliente>(`/clientes/${id_cliente}`, datos),

  eliminar: (id_cliente: number) =>
    cliente.delete<RespuestaEliminarCliente>(`/clientes/${id_cliente}`),
}
