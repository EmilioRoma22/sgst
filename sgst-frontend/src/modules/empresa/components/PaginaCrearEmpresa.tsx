import React, { useState } from "react"
import { Navigate } from "react-router-dom"
import { useUsuarioStore } from "../../auth/stores/usuario.store"
import { ESTILO_INPUT, ESTILO_ETIQUETA, ESTILO_BOTON_SUBMIT } from "../../auth/helpers/auth.estilos"
import { useCrearEmpresa } from "../hooks/useCrearEmpresa"
import type { CrearEmpresaDTO } from "../types/empresa.types"

const estadoInicial: CrearEmpresaDTO = {
  nombre_empresa: "",
  rfc_empresa: null,
  telefono_empresa: null,
  correo_empresa: null,
  direccion_empresa: null,
}

function PaginaCrearEmpresa() {
  const usuario = useUsuarioStore((s) => s.usuario)
  const [datos, setDatos] = useState<CrearEmpresaDTO>(estadoInicial)

  const crearEmpresaMutation = useCrearEmpresa()

  if (usuario?.id_empresa) return <Navigate to="/suscripciones" replace />

  const handleCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value === "" ? null : value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    crearEmpresaMutation.mutate({
      ...datos,
      nombre_empresa: datos.nombre_empresa.trim(),
    })
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <div className="hidden lg:flex lg:w-[42%] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-950/40 via-zinc-900 to-indigo-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
        <img
          src="/sgst_logo_white.svg"
          alt="SGST"
          className="w-72 relative z-10 drop-shadow-[0_0_40px_rgba(59,130,246,0.12)]"
        />
      </div>

      <div className="w-full lg:w-[58%] flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/sgst_logo_white.svg" alt="SGST" className="w-32" />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Crear empresa
            </h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Registra los datos de tu empresa para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="nombre_empresa" className={ESTILO_ETIQUETA}>
                Nombre de la empresa <span className="text-red-400">*</span>
              </label>
              <input
                id="nombre_empresa"
                type="text"
                name="nombre_empresa"
                value={datos.nombre_empresa}
                onChange={handleCambio}
                placeholder="Mi Empresa S.L."
                className={ESTILO_INPUT}
                required
                disabled={crearEmpresaMutation.isPending}
              />
            </div>

            <div>
              <label htmlFor="rfc_empresa" className={ESTILO_ETIQUETA}>
                RFC / CIF
              </label>
              <input
                id="rfc_empresa"
                type="text"
                name="rfc_empresa"
                value={datos.rfc_empresa ?? ""}
                onChange={handleCambio}
                placeholder="Opcional"
                className={ESTILO_INPUT}
                disabled={crearEmpresaMutation.isPending}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="telefono_empresa" className={ESTILO_ETIQUETA}>
                  Teléfono
                </label>
                <input
                  id="telefono_empresa"
                  type="tel"
                  name="telefono_empresa"
                  value={datos.telefono_empresa ?? ""}
                  onChange={handleCambio}
                  placeholder="Opcional"
                  className={ESTILO_INPUT}
                  disabled={crearEmpresaMutation.isPending}
                />
              </div>
              <div>
                <label htmlFor="correo_empresa" className={ESTILO_ETIQUETA}>
                  Correo de la empresa
                </label>
                <input
                  id="correo_empresa"
                  type="email"
                  name="correo_empresa"
                  value={datos.correo_empresa ?? ""}
                  onChange={handleCambio}
                  placeholder="Opcional"
                  className={ESTILO_INPUT}
                  disabled={crearEmpresaMutation.isPending}
                />
              </div>
            </div>

            <div>
              <label htmlFor="direccion_empresa" className={ESTILO_ETIQUETA}>
                Dirección
              </label>
              <textarea
                id="direccion_empresa"
                name="direccion_empresa"
                value={datos.direccion_empresa ?? ""}
                onChange={handleCambio}
                placeholder="Opcional"
                rows={3}
                className={`${ESTILO_INPUT} resize-none`}
                disabled={crearEmpresaMutation.isPending}
              />
            </div>

            <button
              type="submit"
              disabled={crearEmpresaMutation.isPending}
              className={ESTILO_BOTON_SUBMIT}
            >
              {crearEmpresaMutation.isPending ? "Creando..." : "Crear empresa"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PaginaCrearEmpresa
