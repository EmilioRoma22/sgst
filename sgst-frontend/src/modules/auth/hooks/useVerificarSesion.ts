import { useEffect, useState } from "react"
import { authService } from "../services/auth.service"
import { useUsuarioStore } from "../stores/usuario.store"
import { useTallerStore } from "../stores/taller.store"

interface ResultadoVerificacion {
  cargando: boolean
  autenticado: boolean
}

let verificacionEnCurso = false

export function useVerificarSesion(): ResultadoVerificacion {
  const usuario = useUsuarioStore((s) => s.usuario)
  const setUsuario = useUsuarioStore((s) => s.setUsuario)
  const setTaller = useTallerStore((s) => s.setTaller)

  const [cargando, setCargando] = useState(!usuario)
  const [autenticado, setAutenticado] = useState(!!usuario)

  useEffect(() => {
    if (usuario) return
    if (verificacionEnCurso) return

    verificacionEnCurso = true

    Promise.all([authService.meValidado(), authService.meTallerValidado()])
      .then(([usuarioValidado, tallerValidado]) => {
        setUsuario(usuarioValidado)
        setTaller(tallerValidado)
        setAutenticado(true)
      })
      .catch(() => {
        setAutenticado(false)
      })
      .finally(() => {
        setCargando(false)
        verificacionEnCurso = false
      })
  }, [usuario, setUsuario, setTaller])

  return { cargando, autenticado }
}
