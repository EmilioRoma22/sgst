import { z } from "zod"

const emailOptional = z.preprocess(
  (val) => (val === "" ? null : val),
  z
    .string()
    .email("Formato de correo inválido")
    .max(150)
    .nullable()
    .or(z.null())
)

const telefonoOptional = z.preprocess(
  (val) => (val === "" ? null : val),
  z
    .string()
    .regex(/^[\d\s+\-()]{8,20}$/, "Formato de teléfono inválido")
    .max(20)
    .nullable()
    .or(z.null())
)

export const crearClienteSchema = z.object({
  nombre_cliente: z.string().min(1, "El nombre es requerido").max(100),
  apellidos_cliente: z.string().min(1, "Los apellidos son requeridos").max(100),
  correo_cliente: emailOptional,
  telefono_cliente: telefonoOptional,
  direccion_cliente: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().max(255).nullable().or(z.null())
  ),
  notas_cliente: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().or(z.null())
  ),
})

export const actualizarClienteSchema = z.object({
  nombre_cliente: z.string().min(1).max(100).optional(),
  apellidos_cliente: z.string().min(1).max(100).optional(),
  correo_cliente: emailOptional.optional(),
  telefono_cliente: telefonoOptional.optional(),
  direccion_cliente: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().max(255).nullable().optional().or(z.null())
  ),
  notas_cliente: z.preprocess(
    (val) => (val === "" ? null : val),
    z.string().nullable().optional().or(z.null())
  ),
})

export type CrearClienteValidado = z.infer<typeof crearClienteSchema>
export type ActualizarClienteValidado = z.infer<typeof actualizarClienteSchema>
