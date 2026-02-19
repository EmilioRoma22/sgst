import cliente from "../../../api/cliente"
import type {
  DatosLogin,
  DatosRegistro,
  RespuestaApi,
  UsuarioMe,
  TallerMe,
} from "../types/auth.types"
import {
  usuarioMeSchema,
  tallerMeNullableSchema,
  type UsuarioMeValidado,
  type TallerMeValidado,
} from "../schemas/auth.schemas"

export const authService = {
  login: (datos: DatosLogin) =>
    cliente.post<RespuestaApi>("/auth/login", datos),

  registro: (datos: DatosRegistro) =>
    cliente.post<RespuestaApi>("/auth/registro", datos),

  loginTaller: () =>
    cliente.post<RespuestaApi>("/auth/login/taller"),

  me: () =>
    cliente.get<UsuarioMe>("/auth/me"),

  meTaller: () =>
    cliente.get<TallerMe | null>("/auth/me/taller"),

  cerrarSesion: () =>
    cliente.post<{ message: string }>("/auth/cerrar_sesion"),

  elegirTaller: (id_taller: string) =>
    cliente.post<{ message: string }>("/auth/taller", { id_taller }),

  /**
   * Obtiene /auth/me y valida la respuesta con esquema Zod.
   * Rechaza si la respuesta no cumple el contrato (p. ej. intercepción).
   */
  async meValidado(): Promise<UsuarioMeValidado> {
    const { data } = await cliente.get<unknown>("/auth/me")
    const resultado = usuarioMeSchema.safeParse(data)
    if (!resultado.success) {
      throw new Error("Respuesta de sesión inválida")
    }
    return resultado.data
  },

  /**
   * Obtiene /auth/me/taller y valida la respuesta con esquema Zod.
   * Rechaza si la respuesta no cumple el contrato (p. ej. intercepción).
   */
  async meTallerValidado(): Promise<TallerMeValidado | null> {
    const { data } = await cliente.get<unknown>("/auth/me/taller")
    const resultado = tallerMeNullableSchema.safeParse(data)
    if (!resultado.success) {
      throw new Error("Respuesta de taller inválida")
    }
    return resultado.data
  },
}
