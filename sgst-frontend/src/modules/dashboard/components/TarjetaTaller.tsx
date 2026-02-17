import type { TallerListaDto } from "../../talleres/types/taller.types"

interface TarjetaTallerProps {
  taller: TallerListaDto
}

function TarjetaTaller({ taller }: TarjetaTallerProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-700/50 bg-zinc-900/60 p-6 shadow-lg transition-all duration-300 hover:border-zinc-600/80 hover:shadow-xl hover:bg-zinc-900/80">
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
