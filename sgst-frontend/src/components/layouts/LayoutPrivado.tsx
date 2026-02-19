import { Outlet } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { motion } from "motion/react"
import { useTallerStore } from "../../modules/auth/stores/taller.store"
import { useSidebarStore } from "../../modules/dashboard/stores/sidebar.store"
import { useWindowSize } from "../../hooks/useWindowSize"
import Sidebar from "../../modules/dashboard/components/Sidebar"

function LayoutPrivado() {
  const taller = useTallerStore((s) => s.taller)
  const { colapsado } = useSidebarStore()
  const { isDesktop } = useWindowSize()

  if (!taller) {
    return <Navigate to="/login" replace />
  }

  const marginLeft = isDesktop ? (colapsado ? 80 : 280) : 0

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <motion.main
        animate={{
          marginLeft: `${marginLeft}px`,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 overflow-x-hidden w-full"
      >
        <div className="h-full min-h-screen w-full">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}

export default LayoutPrivado
