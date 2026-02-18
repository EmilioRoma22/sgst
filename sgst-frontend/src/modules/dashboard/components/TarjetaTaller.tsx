import type { TallerListaDto } from "../../talleres/types/taller.types"

interface TarjetaTallerProps {
  taller: TallerListaDto
  onSeleccionar?: (taller: TallerListaDto) => void
  deshabilitado?: boolean
}

function TarjetaTaller({ taller, onSeleccionar, deshabilitado = false }: TarjetaTallerProps) {
  const handleClick = () => {
    if (deshabilitado || !onSeleccionar) return
    onSeleccionar(taller)
  }

  const esClicable = Boolean(onSeleccionar)

  return (
    <div
      role={esClicable ? "button" : undefined}
      tabIndex={esClicable ? 0 : undefined}
      onClick={esClicable ? handleClick : undefined}
      onKeyDown={
        esClicable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleClick()
              }
            }
          : undefined
      }
      className={`w-full rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-6 shadow-lg transition-all duration-300 ${
        esClicable && !deshabilitado
          ? "cursor-pointer hover:border-violet-500/60 hover:shadow-xl hover:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 focus:ring-offset-zinc-950"
          : ""
      } ${deshabilitado ? "pointer-events-none opacity-60" : ""}`}
    >
      <div className="flex flex-col gap-5">
        <h3 className="bg-linear-to-r from-violet-300 via-fuchsia-300 to-violet-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          {taller.nombre_taller}
        </h3>
        <div className="grid gap-3 text-sm min-[480px]:grid-cols-2">
          {taller.telefono_taller && (
            <p className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 text-zinc-300">
              <span className="text-zinc-500 shrink-0">Tel.</span>
              {taller.telefono_taller}
            </p>
          )}
          {taller.correo_taller && (
            <p className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 text-zinc-300">
              <span className="text-zinc-500 shrink-0">Correo</span>
              <span className="truncate">{taller.correo_taller}</span>
            </p>
          )}
          {taller.direccion_taller && (
            <p className="flex items-start gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 text-zinc-300 min-[480px]:col-span-2">
              <span className="text-zinc-500 shrink-0">Dir.</span>
              <span className="line-clamp-2">{taller.direccion_taller}</span>
            </p>
          )}
          {taller.rfc_taller && (
            <p className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2 text-zinc-300">
              <span className="text-zinc-500 shrink-0">RFC</span>
              {taller.rfc_taller}
            </p>
          )}
          {!taller.telefono_taller &&
            !taller.correo_taller &&
            !taller.direccion_taller &&
            !taller.rfc_taller && (
              <p className="rounded-lg bg-zinc-800/30 px-3 py-2 text-zinc-500 text-sm min-[480px]:col-span-2">
                Sin datos de contacto
              </p>
            )}
        </div>
      </div>
    </div>
  )
}

export default TarjetaTaller
