import { Navigate } from "react-router-dom"
import { useTallerStore } from "../../auth/stores/taller.store"

function PaginaDashboard() {
  const taller = useTallerStore((s) => s.taller)

  if (!taller) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 text-sm">
          Bienvenido al panel principal del taller.
        </p>
      </div>
    </div>
  )
}

export default PaginaDashboard
