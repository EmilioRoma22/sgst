import React from "react"
import {
  ROL_TALLER_ADMIN,
  ROL_TALLER_TECNICO,
  ROL_TALLER_RECEPCIONISTA,
} from "../../auth/constants/roles"

export interface ModuloDashboard {
  id: string
  nombre: string
  ruta: string
  icono: React.FC<React.SVGProps<SVGSVGElement>>
  roles: string[]
}

const IconoClientes: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
)

const IconoEquipos: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
    />
  </svg>
)

const IconoOrdenes: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
    />
  </svg>
)

const IconoRefacciones: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    />
  </svg>
)

const IconoProductosVenta: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
)

const IconoCompras: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21m-1.5-1.5H18.75m-12 3h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Zm-3-6h.008v.008H3.75V12Zm0 3h.008v.008H3.75V15Zm0 3h.008v.008H3.75V18Z"
    />
  </svg>
)

const IconoVentas: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21m-1.5-1.5H18.75m-12 3h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Zm-3-6h.008v.008H3.75V12Zm0 3h.008v.008H3.75V15Zm0 3h.008v.008H3.75V18Z"
    />
  </svg>
)

const IconoFinanzas: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
)

const IconoGastos: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21m-1.5-1.5H18.75m-12 3h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Zm-3-6h.008v.008H3.75V12Zm0 3h.008v.008H3.75V15Zm0 3h.008v.008H3.75V18Z"
    />
  </svg>
)

const IconoProveedores: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.25m0 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75Zm-9 0v4.25c0 .414-.336.75-.75.75H6a.75.75 0 0 1-.75-.75v-4.25m0 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75Zm-9 0v4.25c0 .414-.336.75-.75.75H2.25a.75.75 0 0 1-.75-.75v-4.25m0 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75Zm15 0v-4.25c0-.414-.336-.75-.75-.75h-3.75a.75.75 0 0 0-.75.75v4.25m0 0a.75.75 0 0 0 .75.75h3.75a.75.75 0 0 0 .75-.75Zm-9 0v-4.25c0-.414-.336-.75-.75-.75h-3.75a.75.75 0 0 0-.75.75v4.25m0 0a.75.75 0 0 0 .75.75h3.75a.75.75 0 0 0 .75-.75Zm-9 0v-4.25c0-.414-.336-.75-.75-.75H2.25a.75.75 0 0 0-.75.75v4.25m0 0a.75.75 0 0 0 .75.75h3.75a.75.75 0 0 0 .75-.75Z"
    />
  </svg>
)

const IconoCalendario: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
)

const IconoConfiguracion: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
)

export const MODULOS_DASHBOARD: ModuloDashboard[] = [
  {
    id: "clientes",
    nombre: "Clientes",
    ruta: "/dashboard/clientes",
    icono: IconoClientes,
    roles: [ROL_TALLER_ADMIN, ROL_TALLER_RECEPCIONISTA],
  },
  {
    id: "equipos",
    nombre: "Equipos",
    ruta: "/dashboard/equipos",
    icono: IconoEquipos,
    roles: [ROL_TALLER_ADMIN],
  },
  {
    id: "ordenes",
    nombre: "Órdenes",
    ruta: "/dashboard/ordenes",
    icono: IconoOrdenes,
    roles: [ROL_TALLER_ADMIN, ROL_TALLER_TECNICO, ROL_TALLER_RECEPCIONISTA],
  },
  {
    id: "refacciones",
    nombre: "Refacciones",
    ruta: "/dashboard/refacciones",
    icono: IconoRefacciones,
    roles: [ROL_TALLER_ADMIN, ROL_TALLER_TECNICO],
  },
  {
    id: "productos-venta",
    nombre: "Productos Venta",
    ruta: "/dashboard/productos-venta",
    icono: IconoProductosVenta,
    roles: [ROL_TALLER_ADMIN],
  },
  {
    id: "compras",
    nombre: "Compras",
    ruta: "/dashboard/compras",
    icono: IconoCompras,
    roles: [ROL_TALLER_ADMIN],
  },
  {
    id: "ventas",
    nombre: "Ventas",
    ruta: "/dashboard/ventas",
    icono: IconoVentas,
    roles: [ROL_TALLER_ADMIN, ROL_TALLER_RECEPCIONISTA],
  },
  {
    id: "finanzas",
    nombre: "Finanzas",
    ruta: "/dashboard/finanzas",
    icono: IconoFinanzas,
    roles: [ROL_TALLER_ADMIN],
  },
  {
    id: "gastos",
    nombre: "Gastos",
    ruta: "/dashboard/gastos",
    icono: IconoGastos,
    roles: [ROL_TALLER_ADMIN],
  },
  {
    id: "proveedores",
    nombre: "Proveedores",
    ruta: "/dashboard/proveedores",
    icono: IconoProveedores,
    roles: [ROL_TALLER_ADMIN],
  },
  {
    id: "calendario",
    nombre: "Calendario",
    ruta: "/dashboard/calendario",
    icono: IconoCalendario,
    roles: [ROL_TALLER_ADMIN, ROL_TALLER_TECNICO],
  },
  {
    id: "configuracion",
    nombre: "Configuración",
    ruta: "/dashboard/configuracion",
    icono: IconoConfiguracion,
    roles: [ROL_TALLER_ADMIN, ROL_TALLER_TECNICO, ROL_TALLER_RECEPCIONISTA],
  },
]

export function obtenerModulosPorRol(rol: string): ModuloDashboard[] {
  return MODULOS_DASHBOARD.filter((modulo) => modulo.roles.includes(rol))
}
