import { z } from "zod"

/** Listado de licencias (la API no devuelve id_licencia). */
export const licenciaDtoSchema = z.object({
  nombre_licencia: z.string(),
  descripcion: z.string().nullable(),
  precio_mensual: z.string(),
  precio_anual: z.string(),
  max_talleres: z.number(),
  max_usuarios: z.number(),
})

export const suscripcionDtoSchema = z.object({
  id_suscripcion: z.number(),
  id_empresa: z.uuid(),
  id_licencia: z.uuid(),
  fecha_inicio: z.string(),
  fecha_fin: z.string().nullable(),
  activa: z.boolean(),
})

export const verificacionSuscripcionSchema = z.object({
  tiene_suscripcion: z.boolean(),
  id_licencia: z.uuid().nullable(),
})

export type VerificacionSuscripcionValidado = z.infer<
  typeof verificacionSuscripcionSchema
>
