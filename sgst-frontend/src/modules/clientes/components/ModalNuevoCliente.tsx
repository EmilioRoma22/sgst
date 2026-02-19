import React, { useState, useEffect } from "react"
import Modal from "../../../components/ui/Modal"
import { ESTILO_INPUT, ESTILO_ETIQUETA, ESTILO_BOTON_SUBMIT } from "../../auth/helpers/auth.estilos"
import type { CrearClienteDTO } from "../types/cliente.types"

const estadoInicial: CrearClienteDTO = {
  nombre_cliente: "",
  apellidos_cliente: "",
  correo_cliente: null,
  telefono_cliente: null,
  direccion_cliente: null,
  notas_cliente: null,
}

interface ModalNuevoClienteProps {
  open: boolean
  onClose: () => void
  onSubmit: (datos: CrearClienteDTO) => void
  deshabilitado: boolean
}

function ModalNuevoCliente({
  open,
  onClose,
  onSubmit,
  deshabilitado,
}: ModalNuevoClienteProps) {
  const [datos, setDatos] = useState<CrearClienteDTO>(estadoInicial)

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
      nombre_cliente: datos.nombre_cliente.trim(),
      apellidos_cliente: datos.apellidos_cliente.trim(),
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo cliente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="modal-nombre_cliente" className={ESTILO_ETIQUETA}>
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            id="modal-nombre_cliente"
            type="text"
            name="nombre_cliente"
            value={datos.nombre_cliente}
            onChange={handleCambio}
            placeholder="Ej. Juan"
            className={ESTILO_INPUT}
            required
            maxLength={100}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-apellidos_cliente" className={ESTILO_ETIQUETA}>
            Apellidos <span className="text-red-400">*</span>
          </label>
          <input
            id="modal-apellidos_cliente"
            type="text"
            name="apellidos_cliente"
            value={datos.apellidos_cliente}
            onChange={handleCambio}
            placeholder="Ej. Pérez García"
            className={ESTILO_INPUT}
            required
            maxLength={100}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-correo_cliente" className={ESTILO_ETIQUETA}>
            Correo electrónico
          </label>
          <input
            id="modal-correo_cliente"
            type="email"
            name="correo_cliente"
            value={datos.correo_cliente ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            className={ESTILO_INPUT}
            maxLength={150}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-telefono_cliente" className={ESTILO_ETIQUETA}>
            Teléfono
          </label>
          <input
            id="modal-telefono_cliente"
            type="tel"
            name="telefono_cliente"
            value={datos.telefono_cliente ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            className={ESTILO_INPUT}
            maxLength={20}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-direccion_cliente" className={ESTILO_ETIQUETA}>
            Dirección
          </label>
          <textarea
            id="modal-direccion_cliente"
            name="direccion_cliente"
            value={datos.direccion_cliente ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            rows={2}
            className={`${ESTILO_INPUT} resize-none`}
            maxLength={255}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-notas_cliente" className={ESTILO_ETIQUETA}>
            Notas
          </label>
          <textarea
            id="modal-notas_cliente"
            name="notas_cliente"
            value={datos.notas_cliente ?? ""}
            onChange={handleCambio}
            placeholder="Opcional"
            rows={3}
            className={`${ESTILO_INPUT} resize-none`}
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
            {deshabilitado ? "Creando..." : "Crear cliente"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ModalNuevoCliente
