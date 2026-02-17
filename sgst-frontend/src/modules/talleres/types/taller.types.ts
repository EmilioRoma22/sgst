export interface TallerListaDto {
  id_taller: number
  id_empresa: number
  nombre_taller: string
  telefono_taller: string | null
  correo_taller: string | null
  direccion_taller: string | null
  rfc_taller: string | null
  ruta_logo: string | null
}

export interface CrearTallerDTO {
  nombre_taller: string
  telefono_taller: string | null
  correo_taller: string | null
  direccion_taller: string | null
  rfc_taller: string | null
}
