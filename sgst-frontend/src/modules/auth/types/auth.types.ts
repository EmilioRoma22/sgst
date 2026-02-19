export interface DatosLogin {
  correo_usuario: string
  password_usuario: string
}

export interface DatosRegistro {
  nombre_usuario: string
  apellidos_usuario: string
  correo_usuario: string
  telefono_usuario: string
  password_usuario: string
  confirmar_password_usuario: string
}

export interface RespuestaApi {
  message: string
}

export interface ErrorApi {
  error: {
    code: string
    message: string
  }
}

export interface UsuarioMe {
  id_usuario: string
  id_empresa: string | null
  nombre_usuario: string
  apellidos_usuario: string
  correo_usuario: string
  telefono_usuario: string
}

export interface TallerMe {
  id_taller: string
  rol_taller: string
}
