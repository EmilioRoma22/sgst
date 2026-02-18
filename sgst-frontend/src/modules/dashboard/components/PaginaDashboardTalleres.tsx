import { useState, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import type { AxiosError } from "axios"
import { useUsuarioStore } from "../../auth/stores/usuario.store"
import { useTallerStore } from "../../auth/stores/taller.store"
import { authService } from "../../auth/services/auth.service"
import { ROL_TALLER_ADMIN } from "../../auth/constants/roles"
import PantallaCarga from "../../../components/ui/PantallaCarga"
import { mostrarToast } from "../../../helpers/toast"
import { useVerificarSuscripcion } from "../../suscripciones/hooks/useVerificarSuscripcion"
import { useTalleres } from "../../talleres/hooks/useTalleres"
import { useCrearTaller } from "../../talleres/hooks/useCrearTaller"
import type { ErrorApi } from "../../auth/types/auth.types"
import type { CrearTallerDTO } from "../../talleres/types/taller.types"
import TarjetaTaller from "./TarjetaTaller"
import ModalNuevoTaller from "./ModalNuevoTaller"
import ModalCerrarSesion from "./ModalCerrarSesion"

function PaginaDashboardTalleres() {
  const navigate = useNavigate()
  const usuario = useUsuarioStore((s) => s.usuario)
  const clearUsuario = useUsuarioStore((s) => s.clearUsuario)
  const clearTaller = useTallerStore((s) => s.clearTaller)
  const setTaller = useTallerStore((s) => s.setTaller)
  const { data: verificacion, isLoading: cargandoVerificacion } =
    useVerificarSuscripcion()
  const { data: talleres, isLoading: cargandoTalleres } = useTalleres()
  const crearTaller = useCrearTaller()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalCerrarSesionAbierto, setModalCerrarSesionAbierto] = useState(false)
  const [cerrandoSesion, setCerrandoSesion] = useState(false)
  const [elegiendoTallerId, setElegiendoTallerId] = useState<number | null>(null)

  useEffect(() => {
    if (crearTaller.isSuccess) {
      setModalAbierto(false)
      crearTaller.reset()
    }
  }, [crearTaller.isSuccess, crearTaller])

  if (!usuario?.id_empresa) return <Navigate to="/empresa/crear" replace />
  if (cargandoVerificacion) return <PantallaCarga />
  if (!verificacion?.tiene_suscripcion) {
    return <Navigate to="/suscripciones" replace />
  }

  const maxTalleres = verificacion.licencia?.max_talleres ?? 0
  const cantidad = talleres?.length ?? 0
  const limiteAlcanzado = maxTalleres > 0 && cantidad >= maxTalleres

  const handleCrearTaller = (datos: CrearTallerDTO) => {
    crearTaller.mutate(datos)
  }

  const handleCerrarSesion = async () => {
    setCerrandoSesion(true)
    try {
      await authService.cerrarSesion()
      clearUsuario()
      clearTaller()
      setModalCerrarSesionAbierto(false)
      navigate("/login", { replace: true })
    } finally {
      setCerrandoSesion(false)
    }
  }

  const handleSeleccionarTaller = async (taller: { id_taller: number }) => {
    setElegiendoTallerId(taller.id_taller)
    try {
      await authService.elegirTaller(taller.id_taller)
      setTaller({ id_taller: taller.id_taller, rol_taller: ROL_TALLER_ADMIN })
      navigate("/dashboard", { replace: true })
    } catch (err) {
      const mensaje =
        (err as AxiosError<ErrorApi>)?.response?.data?.error?.message ||
        "No se pudo seleccionar el taller"
      mostrarToast.error(mensaje)
    } finally {
      setElegiendoTallerId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <div className="hidden lg:flex lg:w-[38%] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-violet-950/30 via-zinc-900 to-fuchsia-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <img
            src="/sgst_logo_white.svg"
            alt="SGST"
            className="w-60 drop-shadow-[0_0_45px_rgba(139,92,246,0.12)]"
          />
          <p className="max-w-[240px] text-center text-sm text-zinc-400">
            Gestiona los talleres de tu empresa. Selecciona uno para continuar.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[62%] overflow-y-auto">
        <div className="mx-auto max-w-4xl p-6 sm:p-8 lg:p-12">
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/sgst_logo_white.svg" alt="SGST" className="w-24" />
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Tus talleres
              </h1>
              <p className="mt-2 text-zinc-400 text-sm sm:text-base">
                {maxTalleres > 0 ? (
                  <>
                    <span className="font-medium text-zinc-300">{cantidad}</span>
                    {" de "}
                    <span className="font-medium text-zinc-300">{maxTalleres}</span>
                    {" talleres según tu plan."}
                  </>
                ) : (
                  "Lista de talleres de tu empresa."
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalCerrarSesionAbierto(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/60 px-4 py-3 font-medium text-red-400 transition-all hover:bg-red-500/10 hover:border-red-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                </svg>
                Cerrar sesión
              </button>
              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                disabled={limiteAlcanzado}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition-all hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed disabled:hover:bg-zinc-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Agregar taller
              </button>
            </div>
          </div>

          {limiteAlcanzado && (
            <p className="mb-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-200">
              Has alcanzado el límite de talleres de tu plan. Actualiza tu suscripción para crear más.
            </p>
          )}

          {cargandoTalleres ? (
            <div className="flex flex-col gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 w-full animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
                />
              ))}
            </div>
          ) : talleres && talleres.length > 0 ? (
            <div className="flex flex-col gap-5">
              {talleres.map((taller) => (
                <TarjetaTaller
                  key={taller.id_taller}
                  taller={taller}
                  onSeleccionar={handleSeleccionarTaller}
                  deshabilitado={elegiendoTallerId !== null}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-900/30 p-12 text-center">
              <p className="text-zinc-400 mb-1">
                Aún no tienes talleres registrados.
              </p>
              <p className="text-zinc-500 text-sm">
                Podrás crear hasta {maxTalleres} taller{maxTalleres !== 1 ? "es" : ""} con tu plan actual.
              </p>
            </div>
          )}

          <ModalNuevoTaller
            open={modalAbierto}
            onClose={() => setModalAbierto(false)}
            onSubmit={handleCrearTaller}
            deshabilitado={crearTaller.isPending}
          />
          <ModalCerrarSesion
            open={modalCerrarSesionAbierto}
            onClose={() => setModalCerrarSesionAbierto(false)}
            onConfirm={handleCerrarSesion}
            deshabilitado={cerrandoSesion}
          />
        </div>
      </div>
    </div>
  )
}

export default PaginaDashboardTalleres
