import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { useTallerStore } from "../../auth/stores/taller.store"
import { useUsuarioStore } from "../../auth/stores/usuario.store"
import { obtenerModulosPorRol, type ModuloDashboard } from "../config/modulos.config"
import { useSidebarStore } from "../stores/sidebar.store"
import { useNombreTaller } from "../hooks/useNombreTaller"
import { useCerrarSesion } from "../../auth/hooks/useCerrarSesion"
import { useWindowSize } from "../../../hooks/useWindowSize"
import ModalCerrarSesion from "./ModalCerrarSesion"
import {
  ROL_TALLER_ADMIN,
  ROL_TALLER_TECNICO,
  ROL_TALLER_RECEPCIONISTA,
} from "../../auth/constants/roles"

function Sidebar() {
  const { colapsado, toggleColapsado } = useSidebarStore()
  const [abiertoMovil, setAbiertoMovil] = useState(false)
  const [modalCerrarSesionAbierto, setModalCerrarSesionAbierto] = useState(false)
  const ubicacion = useLocation()
  const taller = useTallerStore((s) => s.taller)
  const usuario = useUsuarioStore((s) => s.usuario)
  const nombreTaller = useNombreTaller()
  const { mutate: cerrarSesion, isPending: cerrandoSesion } = useCerrarSesion()
  const { isDesktop } = useWindowSize()

  // Obtener módulos según el rol
  const modulos: ModuloDashboard[] = taller
    ? obtenerModulosPorRol(taller.rol_taller)
    : []

  // Cerrar sidebar móvil cuando cambia a desktop
  useEffect(() => {
    if (isDesktop) {
      setAbiertoMovil(false)
    }
  }, [isDesktop])

  // Cerrar sidebar móvil al cambiar de ruta
  useEffect(() => {
    setAbiertoMovil(false)
  }, [ubicacion.pathname])

  const esActivo = (ruta: string) => ubicacion.pathname === ruta

  const obtenerNombreRol = (rol: string) => {
    switch (rol) {
      case ROL_TALLER_ADMIN:
        return "Administrador"
      case ROL_TALLER_TECNICO:
        return "Técnico"
      case ROL_TALLER_RECEPCIONISTA:
        return "Recepcionista"
      default:
        return rol
    }
  }

  const nombreCompletoUsuario = usuario
    ? `${usuario.nombre_usuario} ${usuario.apellidos_usuario}`.trim()
    : "Usuario"

  const handleCerrarSesion = () => {
    cerrarSesion()
    setModalCerrarSesionAbierto(false)
  }

  return (
    <>
      <AnimatePresence>
        {abiertoMovil && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setAbiertoMovil(false)}
          />
        )}
      </AnimatePresence>

      {!isDesktop && (
        <motion.button
          onClick={() => setAbiertoMovil(true)}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200 border border-zinc-800 shadow-lg"
          aria-label="Abrir menú"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </motion.button>
      )}

      <motion.aside
        initial={false}
        animate={{
          x: abiertoMovil || isDesktop ? 0 : -320,
          width: colapsado ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`
          fixed top-0 left-0 h-screen bg-zinc-950 border-r border-zinc-900 z-50
          flex flex-col shadow-2xl
        `}
        style={{ width: colapsado ? "80px" : "280px" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-900 shrink-0">
          <AnimatePresence mode="wait">
            {!colapsado ? (
              <motion.div
                key="header-expanded"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <h2 className="text-xl font-bold text-white truncate mb-1">
                  {nombreTaller}
                </h2>
                <p className="text-xs text-zinc-500 truncate">Dashboard</p>
              </motion.div>
            ) : (
              <motion.div
                key="header-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-800">
                  <span className="text-white font-bold text-lg">
                    {nombreTaller.charAt(0).toUpperCase()}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2 ml-2">
            {isDesktop && (
              <motion.button
                onClick={toggleColapsado}
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label={colapsado ? "Expandir menú" : "Colapsar menú"}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                {colapsado ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15l-7.5-7.5 7.5-7.5"
                  />
                )}
              </svg>
            </motion.button>
            )}

            {!isDesktop && (
              <motion.button
                onClick={() => setAbiertoMovil(false)}
                className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Cerrar menú"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <ul className="space-y-1.5">
            {modulos.map((modulo, index) => {
              const Icono = modulo.icono
              const activo = esActivo(modulo.ruta)

              return (
                <motion.li
                  key={modulo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <Link
                    to={modulo.ruta}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl
                      transition-all duration-200
                      group relative
                      ${
                        activo
                          ? "bg-white text-zinc-950 shadow-lg shadow-white/10"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                      }
                    `}
                    title={colapsado ? modulo.nombre : undefined}
                  >
                    {activo && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 rounded-xl bg-white"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icono
                      className={`
                        shrink-0 transition-colors relative z-10
                        w-5 h-5
                        ${
                          activo
                            ? "text-zinc-950"
                            : "text-zinc-400 group-hover:text-white"
                        }
                      `}
                    />
                    {!colapsado && (
                      <span
                        className={`
                          truncate text-sm font-medium relative z-10
                          ${activo ? "text-zinc-950" : ""}
                        `}
                      >
                        {modulo.nombre}
                      </span>
                    )}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-zinc-900 p-4 shrink-0">
          {!colapsado ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-800 shrink-0">
                  <span className="text-white font-semibold text-sm">
                    {usuario
                      ? `${usuario.nombre_usuario.charAt(0)}${usuario.apellidos_usuario.charAt(0)}`.toUpperCase()
                      : "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {nombreCompletoUsuario}
                  </p>
                  <p className="text-zinc-500 text-xs truncate">
                    {taller ? obtenerNombreRol(taller.rol_taller) : ""}
                  </p>
                </div>
              </div>

              <motion.button
                onClick={() => setModalCerrarSesionAbierto(true)}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 border border-zinc-900 hover:border-zinc-800"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                <span className="text-sm font-medium">Cerrar sesión</span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-zinc-800">
                <span className="text-white font-semibold text-sm">
                  {usuario
                    ? `${usuario.nombre_usuario.charAt(0)}${usuario.apellidos_usuario.charAt(0)}`.toUpperCase()
                    : "U"}
                </span>
              </div>
              <motion.button
                onClick={() => setModalCerrarSesionAbierto(true)}
                className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200 border border-zinc-900 hover:border-zinc-800"
                title="Cerrar sesión"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.aside>

      <ModalCerrarSesion
        open={modalCerrarSesionAbierto}
        onClose={() => setModalCerrarSesionAbierto(false)}
        onConfirm={handleCerrarSesion}
        deshabilitado={cerrandoSesion}
      />
    </>
  )
}

export default Sidebar
