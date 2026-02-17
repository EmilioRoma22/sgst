import cliente from "../../../api/cliente"
import type { TallerListaDto, CrearTallerDTO } from "../types/taller.types"

interface RespuestaCrearTaller {
  message: string
}

export const talleresService = {
  listarPorEmpresa: () =>
    cliente.get<TallerListaDto[]>("/talleres"),

  crear: (datos: CrearTallerDTO) =>
    cliente.post<RespuestaCrearTaller>("/talleres", datos),
}
