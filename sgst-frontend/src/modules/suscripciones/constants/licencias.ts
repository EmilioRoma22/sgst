export interface LicenciaConDetalle {
  id_licencia: string
  nombre_licencia: string
  descripcion: string
  precio_mensual: number
  precio_anual: number
  max_talleres: number
  max_usuarios: number
}

export const LICENCIAS: LicenciaConDetalle[] = [
  {
    id_licencia: "96e832d8-928d-4bb3-ab05-fbbeadf6b881",
    nombre_licencia: "Normal",
    descripcion: "Hasta 1 taller y 5 usuarios",
    precio_mensual: 499,
    precio_anual: 4999,
    max_talleres: 1,
    max_usuarios: 5,
  },
  {
    id_licencia: "92931b2d-cb2e-4b68-a854-06434468683a",
    nombre_licencia: "Pro",
    descripcion: "Hasta 2 talleres y 10 usuarios por taller",
    precio_mensual: 899,
    precio_anual: 8999,
    max_talleres: 2,
    max_usuarios: 10,
  },
  {
    id_licencia: "7512bf7a-729b-4e93-8fed-64bdf95d8e74",
    nombre_licencia: "Empresarial",
    descripcion: "Ilimitado",
    precio_mensual: 1499,
    precio_anual: 14999,
    max_talleres: 0, // Ilimitado
    max_usuarios: 0, // Ilimitado
  },
]

export function getLicenciaPorId(
  id_licencia: string
): LicenciaConDetalle | undefined {
  return LICENCIAS.find((l) => l.id_licencia === id_licencia)
}