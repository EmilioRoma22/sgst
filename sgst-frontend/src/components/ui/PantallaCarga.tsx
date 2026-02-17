function PantallaCarga() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-blue-500" />
        <p className="text-sm text-zinc-400">Cargando...</p>
      </div>
    </div>
  )
}

export default PantallaCarga
