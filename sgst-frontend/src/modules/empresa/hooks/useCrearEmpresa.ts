import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import type { AxiosError } from "axios"
import { empresasService } from "../services/empresas.service"
import { authService } from "../../auth/services/auth.service"
import { useUsuarioStore } from "../../auth/stores/usuario.store"
import type { CrearEmpresaDTO } from "../types/empresa.types"
import type { ErrorApi } from "../../auth/types/auth.types"
import { mostrarToast } from "../../../helpers/toast"

export function useCrearEmpresa() {
  const navigate = useNavigate()
  const setUsuario = useUsuarioStore((s) => s.setUsuario)

  return useMutation({
    mutationFn: (datos: CrearEmpresaDTO) => empresasService.crear(datos),
    onSuccess: async (respuesta) => {
      mostrarToast.success(respuesta.data.message)
      const usuarioValidado = await authService.meValidado()
      setUsuario(usuarioValidado)
      navigate("/suscripciones")
    },
    onError: (error: AxiosError<ErrorApi>) => {
      const mensaje =
        error.response?.data?.error?.message || "Error al crear la empresa"
      mostrarToast.error(mensaje)
    },
  })
}
