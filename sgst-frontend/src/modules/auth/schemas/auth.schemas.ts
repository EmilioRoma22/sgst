import { z } from "zod"

export const usuarioMeSchema = z.object({
  id_usuario: z.uuid(),
  id_empresa: z.uuid().nullable(),
  nombre_usuario: z.string(),
  apellidos_usuario: z.string(),
  correo_usuario: z.string(),
  telefono_usuario: z.string(),
})

export const tallerMeSchema = z.object({
  id_taller: z.uuid(),
  rol_taller: z.string(),
})

export const tallerMeNullableSchema = tallerMeSchema.nullable()

export type UsuarioMeValidado = z.infer<typeof usuarioMeSchema>
export type TallerMeValidado = z.infer<typeof tallerMeSchema>
