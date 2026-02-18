import Modal from "../../../components/ui/Modal"

export interface ModalCerrarSesionProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  deshabilitado?: boolean
}

function ModalCerrarSesion({
  open,
  onClose,
  onConfirm,
  deshabilitado = false,
}: ModalCerrarSesionProps) {
  const handleConfirm = () => {
    void Promise.resolve(onConfirm())
  }

  return (
    <Modal open={open} onClose={onClose} title="Cerrar sesión">
      <div className="space-y-5">
        <p className="text-zinc-300 text-sm sm:text-base">
          ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a
          iniciar sesión para acceder al sistema.
        </p>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deshabilitado}
            className="flex-1 py-3 rounded-xl border border-zinc-500 text-zinc-300 hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deshabilitado}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
          >
            {deshabilitado ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalCerrarSesion
