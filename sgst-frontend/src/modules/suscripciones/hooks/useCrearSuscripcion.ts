import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import type { AxiosError } from "axios"
import { suscripcionesService } from "../services/suscripciones.service"
import type { CrearSuscripcionDTO } from "../types/suscripciones.types"
import type { ErrorApi } from "../../auth/types/auth.types"
import { mostrarToast } from "../../../helpers/toast"
import { LICENCIAS_QUERY_KEY } from "./useLicencias"

export function useCrearSuscripcion() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (datos: CrearSuscripcionDTO) => suscripcionesService.crear(datos),
    onSuccess: (respuesta) => {
      mostrarToast.success(respuesta.data.message)
      queryClient.removeQueries({ queryKey: LICENCIAS_QUERY_KEY })
      navigate("/dashboard/talleres")
    },
    onError: (error: AxiosError<ErrorApi>) => {
      const mensaje =
        error.response?.data?.error?.message || "Error al crear la suscripción"
      mostrarToast.error(mensaje)
    },
  })
}
