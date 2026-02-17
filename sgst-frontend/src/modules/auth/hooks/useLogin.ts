import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import type { AxiosError } from "axios"
import { authService } from "../services/auth.service"
import { suscripcionesService } from "../../suscripciones/services/suscripciones.service"
import { verificacionSuscripcionSchema } from "../../suscripciones/schemas/suscripciones.schemas"
import type { DatosLogin, ErrorApi } from "../types/auth.types"
import type { UsuarioMeValidado, TallerMeValidado } from "../schemas/auth.schemas"
import type { VerificacionSuscripcionValidado } from "../../suscripciones/schemas/suscripciones.schemas"
import { useUsuarioStore } from "../stores/usuario.store"
import { useTallerStore } from "../stores/taller.store"
import { mostrarToast } from "../../../helpers/toast"

interface ResultadoLogin {
  mensajeLogin: string
  usuario: UsuarioMeValidado
  taller: TallerMeValidado | null
  verificacionSuscripcion: VerificacionSuscripcionValidado | null
}

export function useLogin() {
  const navigate = useNavigate()
  const setUsuario = useUsuarioStore((state) => state.setUsuario)
  const setTaller = useTallerStore((state) => state.setTaller)

  return useMutation<ResultadoLogin, AxiosError<ErrorApi>, DatosLogin>({
    mutationFn: async (datos) => {
      const respuestaLogin = await authService.login(datos)

      try {
        await authService.loginTaller()
      } catch {
        // 403 = usuario nuevo sin empresa ni taller, se continua
      }

      const [usuario, taller] = await Promise.all([
        authService.meValidado(),
        authService.meTallerValidado(),
      ])

      let verificacionSuscripcion: VerificacionSuscripcionValidado | null = null
      if (!taller && usuario.id_empresa) {
        const { data } = await suscripcionesService.verificar()
        const resultado = verificacionSuscripcionSchema.safeParse(data)
        if (resultado.success) {
          verificacionSuscripcion = resultado.data
        }
      }

      return {
        mensajeLogin: respuestaLogin.data.message,
        usuario,
        taller,
        verificacionSuscripcion,
      }
    },
    onSuccess: ({ mensajeLogin, usuario, taller, verificacionSuscripcion }) => {
      mostrarToast.success(mensajeLogin)
      setUsuario(usuario)
      setTaller(taller)

      if (taller) {
        navigate("/dashboard")
        return
      }

      if (!usuario.id_empresa) {
        navigate("/empresa/crear")
        return
      }

      if (verificacionSuscripcion?.tiene_suscripcion) {
        navigate("/dashboard/talleres")
        return
      }

      navigate("/suscripciones")
    },
    onError: (error) => {
      const mensaje =
        error.response?.data?.error?.message || "Error al iniciar sesión"
      mostrarToast.error(mensaje)
    },
  })
}
