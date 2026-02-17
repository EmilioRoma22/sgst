import cliente from "../../../api/cliente"
import type {
  VerificacionSuscripcion,
  LicenciaDto,
  CrearSuscripcionDTO,
  RespuestaCrearSuscripcion,
} from "../types/suscripciones.types"

export const suscripcionesService = {
  verificar: () =>
    cliente.get<VerificacionSuscripcion>("/suscripciones/verificar"),

  listarLicencias: () =>
    cliente.get<LicenciaDto[]>("/suscripciones/licencias"),

  crear: (datos: CrearSuscripcionDTO) =>
    cliente.post<RespuestaCrearSuscripcion>("/suscripciones", datos),
}
