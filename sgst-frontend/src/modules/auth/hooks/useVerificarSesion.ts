import { useEffect, useState, useRef } from "react"
import { authService } from "../services/auth.service"
import { useUsuarioStore } from "../stores/usuario.store"
import { useTallerStore } from "../stores/taller.store"

interface ResultadoVerificacion {
  cargando: boolean
  autenticado: boolean
}

export function useVerificarSesion(): ResultadoVerificacion {
  const usuario = useUsuarioStore((s) => s.usuario)
  const setUsuario = useUsuarioStore((s) => s.setUsuario)
  const setTaller = useTallerStore((s) => s.setTaller)
  const verificacionEnCursoRef = useRef(false)

  const [cargando, setCargando] = useState(!usuario)
  const [autenticado, setAutenticado] = useState(!!usuario)

  useEffect(() => {
    // Si ya hay usuario, no necesitamos verificar
    if (usuario) {
      setCargando(false)
      setAutenticado(true)
      return
    }

    // Si ya hay una verificación en curso, no iniciar otra
    if (verificacionEnCursoRef.current) {
      return
    }

    verificacionEnCursoRef.current = true
    setCargando(true)

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
        verificacionEnCursoRef.current = false
      })
  }, [usuario, setUsuario, setTaller])

  return { cargando, autenticado }
}
