import cliente from "../../../api/cliente"
import type { CrearEmpresaDTO } from "../types/empresa.types"

interface RespuestaCrearEmpresa {
  message: string
}

export const empresasService = {
  crear: (datos: CrearEmpresaDTO) =>
    cliente.post<RespuestaCrearEmpresa>("/empresas", datos),
}
