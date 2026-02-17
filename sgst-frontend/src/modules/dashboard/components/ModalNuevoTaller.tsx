import React, { useState, useEffect } from "react"
import Modal from "../../../components/ui/Modal"
import { ESTILO_INPUT, ESTILO_ETIQUETA, ESTILO_BOTON_SUBMIT } from "../../auth/helpers/auth.estilos"
import type { CrearTallerDTO } from "../../talleres/types/taller.types"

const estadoInicial: CrearTallerDTO = {
  nombre_taller: "",
  telefono_taller: null,
  correo_taller: null,
  direccion_taller: null,
  rfc_taller: null,
}

interface ModalNuevoTallerProps {
  open: boolean
  onClose: () => void
  onSubmit: (datos: CrearTallerDTO) => void
  deshabilitado: boolean
}

function ModalNuevoTaller({
  open,
  onClose,
  onSubmit,
  deshabilitado,
}: ModalNuevoTallerProps) {
  const [datos, setDatos] = useState<CrearTallerDTO>(estadoInicial)

  useEffect(() => {
    if (open) setDatos(estadoInicial)
  }, [open])

  const handleCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value === "" ? null : value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      ...datos,
      nombre_taller: datos.nombre_taller.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo taller">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="modal-nombre_taller" className={ESTILO_ETIQUETA}>
            Nombre del taller <span className="text-red-400">*</span>
          </label>
          <input
            id="modal-nombre_taller"
            type="text"
            name="nombre_taller"
            value={datos.nombre_taller}
            onChange={handleCambio}
            placeholder="Ej. Taller Centro"
            className={ESTILO_INPUT}
            required
            maxLength={150}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-telefono_taller" className={ESTILO_ETIQUETA}>
            Teléfono
          </label>
          <input
            id="modal-telefono_taller"
            type="tel"
            name="telefono_taller"
            value={datos.telefono_taller ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            className={ESTILO_INPUT}
            maxLength={20}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-correo_taller" className={ESTILO_ETIQUETA}>
            Correo
          </label>
          <input
            id="modal-correo_taller"
            type="email"
            name="correo_taller"
            value={datos.correo_taller ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            className={ESTILO_INPUT}
            maxLength={150}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-direccion_taller" className={ESTILO_ETIQUETA}>
            Dirección
          </label>
          <textarea
            id="modal-direccion_taller"
            name="direccion_taller"
            value={datos.direccion_taller ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            rows={2}
            className={`${ESTILO_INPUT} resize-none`}
            maxLength={255}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-rfc_taller" className={ESTILO_ETIQUETA}>
            RFC
          </label>
          <input
            id="modal-rfc_taller"
            type="text"
            name="rfc_taller"
            value={datos.rfc_taller ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            className={ESTILO_INPUT}
            maxLength={20}
            disabled={deshabilitado}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={deshabilitado}
            className={`flex-1 ${ESTILO_BOTON_SUBMIT}`}
          >
            {deshabilitado ? "Creando..." : "Crear taller"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ModalNuevoTaller
