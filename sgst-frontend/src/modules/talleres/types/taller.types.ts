export interface TallerListaDto {
  id_taller: string
  id_empresa: string
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
