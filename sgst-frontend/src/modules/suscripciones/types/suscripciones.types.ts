/** Respuesta al listar licencias: sin id; la API devuelve nombre, precios (string), límites. */
export interface LicenciaDto {
  nombre_licencia: string
  descripcion: string | null
  precio_mensual: string
  precio_anual: string
  max_talleres: number
  max_usuarios: number
}

export interface SuscripcionDto {
  id_suscripcion: number
  id_empresa: string
  id_licencia: string
  fecha_inicio: string
  fecha_fin: string | null
  activa: boolean
}

export interface VerificacionSuscripcion {
  tiene_suscripcion: boolean
  suscripcion: SuscripcionDto | null
  licencia: LicenciaDto | null
}

export interface CrearSuscripcionDTO {
  precio_mensual: string
}

export interface RespuestaCrearSuscripcion {
  message: string
  suscripcion: SuscripcionDto
}
