import { Navigate } from "react-router-dom"
import { useUsuarioStore } from "../../auth/stores/usuario.store"
import PantallaCarga from "../../../components/ui/PantallaCarga"
import { useVerificarSuscripcion } from "../hooks/useVerificarSuscripcion"
import { useLicencias } from "../hooks/useLicencias"
import { useCrearSuscripcion } from "../hooks/useCrearSuscripcion"
import type { LicenciaDto } from "../types/suscripciones.types"

function formatearPrecio(valor: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(valor)
}

function TarjetaLicencia({
  licencia,
  onSeleccionar,
  deshabilitado,
}: {
  licencia: LicenciaDto
  onSeleccionar: () => void
  deshabilitado: boolean
}) {
  return (
    <div className="group relative flex flex-col rounded-2xl border border-zinc-700/60 bg-zinc-900/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.25)]">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold tracking-tight text-white">
          {licencia.nombre_licencia}
        </h3>
      </div>
      {licencia.descripcion && (
        <p className="mb-5 text-sm text-zinc-400 leading-relaxed">
          {licencia.descripcion}
        </p>
      )}
      <div className="mb-6 flex flex-wrap gap-2">
        <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">
          {licencia.max_talleres} taller{licencia.max_talleres !== 1 ? "es" : ""}
        </span>
        <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">
          {licencia.max_usuarios} usuario{licencia.max_usuarios !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="mt-auto space-y-3 border-t border-zinc-700/50 pt-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            {formatearPrecio(licencia.precio_mensual)}
          </span>
          <span className="text-sm text-zinc-500">/mes</span>
        </div>
        <p className="text-xs text-zinc-500">
          {formatearPrecio(licencia.precio_anual)}/año
        </p>
        <button
          type="button"
          onClick={onSeleccionar}
          disabled={deshabilitado}
          className="w-full py-3 rounded-xl bg-blue-600 font-semibold text-white transition-all duration-200 hover:bg-blue-500 disabled:bg-zinc-700 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2 focus:ring-offset-zinc-900"
        >
          {deshabilitado ? "Procesando..." : "Elegir plan"}
        </button>
      </div>
    </div>
  )
}

function PaginaSuscripciones() {
  const usuario = useUsuarioStore((s) => s.usuario)
  const { data: verificacion, isLoading: cargandoVerificacion } = useVerificarSuscripcion()
  const { data: licencias, isLoading: cargandoLicencias } = useLicencias()
  const crearSuscripcion = useCrearSuscripcion()

  if (!usuario?.id_empresa) return <Navigate to="/empresa/crear" replace />
  if (cargandoVerificacion) return <PantallaCarga />
  if (verificacion?.tiene_suscripcion) return <Navigate to="/dashboard/talleres" replace />

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <div className="hidden lg:flex lg:w-[40%] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-950/30 via-zinc-900 to-teal-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <img
            src="/sgst_logo_white.svg"
            alt="SGST"
            className="w-64 drop-shadow-[0_0_50px_rgba(16,185,129,0.15)]"
          />
          <p className="max-w-[260px] text-center text-sm text-zinc-400">
            Elige el plan que mejor se adapte a tu empresa y empieza a gestionar tus talleres.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-[60%] overflow-y-auto">
        <div className="mx-auto max-w-4xl p-6 sm:p-8 lg:p-12">
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/sgst_logo_white.svg" alt="SGST" className="w-28" />
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Elige tu plan
            </h1>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base">
              Activa tu empresa con una suscripción. Puedes cambiar de plan más adelante.
            </p>
          </div>

          {cargandoLicencias ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[320px] animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50"
                />
              ))}
            </div>
          ) : licencias && licencias.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {licencias.map((licencia) => (
                <TarjetaLicencia
                  key={licencia.id_licencia}
                  licencia={licencia}
                  onSeleccionar={() =>
                    crearSuscripcion.mutate({ id_licencia: licencia.id_licencia })
                  }
                  deshabilitado={crearSuscripcion.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-12 text-center">
              <p className="text-zinc-400">
                No hay planes disponibles en este momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaginaSuscripciones
