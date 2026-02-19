import React, { useState } from "react"
import type { ClienteDTO } from "../types/cliente.types"

interface TablaClientesProps {
  clientes: ClienteDTO[]
  isLoading: boolean
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
  orderBy: string | undefined
  orderDir: "ASC" | "DESC"
  onOrderChange: (orderBy: string) => void
  onPageChange: (page: number) => void
  onClienteClick: (cliente: ClienteDTO) => void
  onEliminarClick: (cliente: ClienteDTO) => void
}

type ColumnaOrdenable = "nombre_cliente" | "apellidos_cliente" | "correo_cliente" | "telefono_cliente"

function TablaClientes({
  clientes,
  isLoading,
  pagination,
  orderBy,
  orderDir,
  onOrderChange,
  onPageChange,
  onClienteClick,
  onEliminarClick,
}: TablaClientesProps) {
  const [, setClienteHover] = useState<number | null>(null)

  const handleOrderClick = (columna: ColumnaOrdenable) => {
    if (orderBy === columna) {
      const nuevaDir = orderDir === "ASC" ? "DESC" : "ASC"
      onOrderChange(`${columna}_${nuevaDir}`)
    } else {
      onOrderChange(columna)
    }
  }

  const getOrderIcon = (columna: ColumnaOrdenable) => {
    if (orderBy !== columna) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-zinc-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
          />
        </svg>
      )
    }
    if (orderDir === "ASC") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      )
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 text-white"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    )
  }

  const ColumnHeader = ({
    columna,
    children,
  }: {
    columna: ColumnaOrdenable
    children: React.ReactNode
  }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:bg-zinc-800/50 transition-colors select-none"
      onClick={() => handleOrderClick(columna)}
    >
      <div className="flex items-center gap-2">
        {children}
        {getOrderIcon(columna)}
      </div>
    </th>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No se encontraron clientes</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-zinc-800/50 border-b border-zinc-700/50">
          <tr>
            <ColumnHeader columna="nombre_cliente">Nombre</ColumnHeader>
            <ColumnHeader columna="apellidos_cliente">Apellidos</ColumnHeader>
            <ColumnHeader columna="correo_cliente">Correo</ColumnHeader>
            <ColumnHeader columna="telefono_cliente">Teléfono</ColumnHeader>
            <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-700/30">
          {clientes.map((cliente) => (
            <tr
              key={cliente.id_cliente}
              className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
              onMouseEnter={() => setClienteHover(cliente.id_cliente)}
              onMouseLeave={() => setClienteHover(null)}
              onClick={() => onClienteClick(cliente)}
            >
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-white">{cliente.nombre_cliente}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-300">{cliente.apellidos_cliente}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-400">
                  {cliente.correo_cliente || (
                    <span className="text-zinc-500 italic">Sin correo</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-400">
                  {cliente.telefono_cliente || (
                    <span className="text-zinc-500 italic">Sin teléfono</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEliminarClick(cliente)
                    }}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                    title="Eliminar cliente"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .56c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-zinc-700/50">
          <div className="text-sm text-zinc-400">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{" "}
            {pagination.total} clientes
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-2 rounded-lg border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-zinc-400">
              Página {pagination.page} de {pagination.total_pages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
              className="px-3 py-2 rounded-lg border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TablaClientes
