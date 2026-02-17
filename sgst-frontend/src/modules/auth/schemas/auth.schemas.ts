import { z } from "zod"

export const usuarioMeSchema = z.object({
  id_usuario: z.number(),
  id_empresa: z.number().nullable(),
  nombre_usuario: z.string(),
  apellidos_usuario: z.string(),
  correo_usuario: z.string(),
  telefono_usuario: z.string(),
})

export const tallerMeSchema = z.object({
  id_taller: z.number(),
  rol_taller: z.string(),
})

export const tallerMeNullableSchema = tallerMeSchema.nullable()

export type UsuarioMeValidado = z.infer<typeof usuarioMeSchema>
export type TallerMeValidado = z.infer<typeof tallerMeSchema>
