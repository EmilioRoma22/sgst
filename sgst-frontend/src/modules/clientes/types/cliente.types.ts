export interface ClienteDTO {
  id_cliente: number
  id_taller: string
  nombre_cliente: string
  apellidos_cliente: string
  correo_cliente: string | null
  telefono_cliente: string | null
  direccion_cliente: string | null
  notas_cliente: string | null
  fecha_creacion: string
  ultima_actualizacion: string | null
}

export interface CrearClienteDTO {
  nombre_cliente: string
  apellidos_cliente: string
  correo_cliente: string | null
  telefono_cliente: string | null
  direccion_cliente: string | null
  notas_cliente: string | null
}

export interface ActualizarClienteDTO {
  nombre_cliente?: string
  apellidos_cliente?: string
  correo_cliente?: string | null
  telefono_cliente?: string | null
  direccion_cliente?: string | null
  notas_cliente?: string | null
}

export interface RespuestaListaClientes {
  data: ClienteDTO[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface RespuestaCrearCliente {
  message: string
  cliente: ClienteDTO
}

export interface RespuestaActualizarCliente {
  message: string
  cliente: ClienteDTO
}

export interface RespuestaEliminarCliente {
  message: string
}
