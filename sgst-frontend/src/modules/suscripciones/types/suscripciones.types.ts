export interface LicenciaDto {
  id_licencia: number
  nombre_licencia: string
  descripcion: string | null
  precio_mensual: number
  precio_anual: number
  max_talleres: number
  max_usuarios: number
}

export interface SuscripcionDto {
  id_suscripcion: number
  id_empresa: number
  id_licencia: number
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
  id_licencia: number
}

export interface RespuestaCrearSuscripcion {
  message: string
  suscripcion: SuscripcionDto
}
