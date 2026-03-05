/**
 * Cliente HTTP para la API. Usa cookies (withCredentials) para identidad.
 *
 * Regla de seguridad: no enviar nunca id_empresa, id_usuario ni id_taller
 * desde el store en body o query. La identidad debe venir solo de cookies/sesión;
 * el backend la obtiene del JWT y la BD. Enviar ids del cliente debilita la seguridad.
 */
import axios from "axios"
import { navigationRef } from "../navigationRef"
import { useTallerStore } from "../modules/auth/stores/taller.store"
import { mostrarToast } from "../helpers/toast"

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _reintentado?: boolean
  }
}

const URL_BASE = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_PREFIX}`

const RUTAS_SIN_REFRESH = [
  "/auth/login",
  "/auth/registro",
  "/auth/refresh",
  "/auth/logout",
  "/auth/cerrar_sesion",
]

const RUTAS_VERIFICACION_SESION = ["/auth/me", "/auth/me/taller"]

const CODIGOS_SESION_TALLER_FINALIZADA = [
  "TALLER_NO_ESPECIFICADO",
  "NO_HAY_TALLER_ACTIVO",
]

const CODIGO_CSRF_INVALIDO = "CSRF_TOKEN_INVALIDO"

const CSRF_HEADER_NAME = "X-CSRF-Token"

const esRutaVerificacion = (url: string | undefined) =>
  RUTAS_VERIFICACION_SESION.some((ruta) => url?.includes(ruta))

let csrfToken: string | null = null

export function setCsrfToken(token: string | null): void {
  csrfToken = token
}

function getCsrfToken(): string | null {
  return csrfToken
}

function esMetodoMutador(method?: string): boolean {
  if (!method) return false
  const m = method.toUpperCase()
  return m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE"
}

const cliente = axios.create({
  baseURL: URL_BASE,
  withCredentials: true,
})

let promesaRefresco: Promise<void> | null = null

cliente.interceptors.request.use((config) => {
  if (esMetodoMutador(config.method)) {
    const token = getCsrfToken()
    if (token) {
      config.headers[CSRF_HEADER_NAME] = token
    }
  }
  return config
})

cliente.interceptors.response.use(
  (respuesta) => {
    const data = respuesta?.data
    if (data && typeof data === "object" && "csrf_token" in data && typeof (data as { csrf_token: unknown }).csrf_token === "string") {
      setCsrfToken((data as { csrf_token: string }).csrf_token)
    }
    if (respuesta.config.url?.includes("/auth/cerrar_sesion")) {
      setCsrfToken(null)
    }
    return respuesta
  },
  async (error) => {
    const configOriginal = error.config
    const codigoError = error.response?.data?.error?.code

    if (CODIGOS_SESION_TALLER_FINALIZADA.includes(codigoError)) {
      useTallerStore.getState().clearTaller()
      mostrarToast.warning("Sesión de taller finalizada. Seleccione un taller.")
      if (navigationRef.current) {
        navigationRef.current("/dashboard/talleres", { replace: true })
      } else {
        window.location.replace("/dashboard/talleres")
      }
      return Promise.reject(error)
    }

    if (error.response?.status === 403 && codigoError === CODIGO_CSRF_INVALIDO) {
      setCsrfToken(null)
      mostrarToast.error("Sesión de seguridad inválida. Inicie sesión de nuevo.")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    const esRutaExcluida = RUTAS_SIN_REFRESH.some((ruta) =>
      configOriginal?.url?.includes(ruta)
    )

    if (
      error.response?.status !== 401 ||
      configOriginal?._reintentado ||
      esRutaExcluida
    ) {
      return Promise.reject(error)
    }

    configOriginal._reintentado = true

    if (!promesaRefresco) {
      promesaRefresco = cliente
        .post("/auth/refresh", null)
        .then(() => {})
        .finally(() => {
          promesaRefresco = null
        })
    }

    try {
      await promesaRefresco
      return cliente(configOriginal)
    } catch {
      if (!esRutaVerificacion(configOriginal?.url)) {
        window.location.href = "/login"
      }
      return Promise.reject(error)
    }
  }
)

export default cliente
