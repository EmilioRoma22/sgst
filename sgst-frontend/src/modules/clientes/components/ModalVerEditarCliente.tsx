import React, { useState, useEffect } from "react"
import Modal from "../../../components/ui/Modal"
import { ESTILO_INPUT, ESTILO_ETIQUETA, ESTILO_BOTON_SUBMIT } from "../../auth/helpers/auth.estilos"
import type { ClienteDTO, ActualizarClienteDTO } from "../types/cliente.types"

interface ModalVerEditarClienteProps {
  open: boolean
  onClose: () => void
  onSubmit: (datos: ActualizarClienteDTO) => void
  cliente: ClienteDTO | null
  deshabilitado: boolean
}

function ModalVerEditarCliente({
  open,
  onClose,
  onSubmit,
  cliente,
  deshabilitado,
}: ModalVerEditarClienteProps) {
  const [datos, setDatos] = useState<ActualizarClienteDTO>({})

  useEffect(() => {
    if (open && cliente) {
      setDatos({
        nombre_cliente: cliente.nombre_cliente,
        apellidos_cliente: cliente.apellidos_cliente,
        correo_cliente: cliente.correo_cliente,
        telefono_cliente: cliente.telefono_cliente,
        direccion_cliente: cliente.direccion_cliente,
        notas_cliente: cliente.notas_cliente,
      })
    }
  }, [open, cliente])

  const handleCambio = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value === "" ? null : value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const datosLimpios: ActualizarClienteDTO = {
      ...datos,
      nombre_cliente: datos.nombre_cliente?.trim(),
      apellidos_cliente: datos.apellidos_cliente?.trim(),
    }
    onSubmit(datosLimpios)
  }

  if (!cliente) return null

  return (
    <Modal open={open} onClose={onClose} title="Editar cliente">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="modal-edit-nombre_cliente" className={ESTILO_ETIQUETA}>
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            id="modal-edit-nombre_cliente"
            type="text"
            name="nombre_cliente"
            value={datos.nombre_cliente ?? ""}
            onChange={handleCambio}
            placeholder="Ej. Juan"
            className={ESTILO_INPUT}
            required
            maxLength={100}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-edit-apellidos_cliente" className={ESTILO_ETIQUETA}>
            Apellidos <span className="text-red-400">*</span>
          </label>
          <input
            id="modal-edit-apellidos_cliente"
            type="text"
            name="apellidos_cliente"
            value={datos.apellidos_cliente ?? ""}
            onChange={handleCambio}
            placeholder="Ej. Pérez García"
            className={ESTILO_INPUT}
            required
            maxLength={100}
            disabled={deshabilitado}
          />
        </div>
        <div>
          <label htmlFor="modal-edit-correo_cliente" className={ESTILO_ETIQUETA}>
            Correo electrónico
          </label>
          <input
            id="modal-edit-correo_cliente"
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
          <label htmlFor="modal-edit-telefono_cliente" className={ESTILO_ETIQUETA}>
            Teléfono
          </label>
          <input
            id="modal-edit-telefono_cliente"
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
          <label htmlFor="modal-edit-direccion_cliente" className={ESTILO_ETIQUETA}>
            Dirección
          </label>
          <textarea
            id="modal-edit-direccion_cliente"
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
          <label htmlFor="modal-edit-notas_cliente" className={ESTILO_ETIQUETA}>
            Notas
          </label>
          <textarea
            id="modal-edit-notas_cliente"
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
            {deshabilitado ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ModalVerEditarCliente
