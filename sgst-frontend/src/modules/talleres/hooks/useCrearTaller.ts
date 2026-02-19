import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { talleresService } from "../services/talleres.service"
import type { CrearTallerDTO } from "../types/taller.types"
import type { ErrorApi } from "../../auth/types/auth.types"
import { mostrarToast } from "../../../helpers/toast"
import { TALLERES_QUERY_KEY } from "./useTalleres"
import { useNavigate } from "react-router-dom"

export function useCrearTaller() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (datos: CrearTallerDTO) => talleresService.crear(datos),
    onSuccess: (respuesta) => {
      mostrarToast.success(respuesta.data.message)
      queryClient.invalidateQueries({ queryKey: TALLERES_QUERY_KEY })
    },
    onError: (error: AxiosError<ErrorApi>) => {
      const mensaje =
        error.response?.data?.error?.message || "Error al crear el taller"
      mostrarToast.error(mensaje)
      if (error.response?.data.error.code === "EMPRESA_SIN_SUSCRIPCION") {
        navigate("/suscripciones")
        return
      }
    },
  })
}
