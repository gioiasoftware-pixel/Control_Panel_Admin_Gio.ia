import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import { TableRow, TableType } from '../types'
import toast from 'react-hot-toast'

interface UserTableProps {
  userId: number
  tableName: string
  tableType: TableType
  editable: boolean
}

export default function UserTable({
  userId,
  tableName,
  editable,
}: UserTableProps) {
  const [page, setPage] = useState(1)
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<TableRow>>({})
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['user-table', userId, tableName, page],
    queryFn: () => apiClient.getUserTable(userId, tableName, { page, limit: 50 }),
    enabled: !!userId && !!tableName,
  })

  const updateMutation = useMutation({
    mutationFn: ({ rowId, data }: { rowId: number; data: Partial<TableRow> }) =>
      apiClient.updateTableRow(userId, tableName, rowId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-table', userId, tableName] })
      setEditingRow(null)
      toast.success('Riga aggiornata con successo')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante l\'aggiornamento')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (rowId: number) =>
      apiClient.deleteTableRow(userId, tableName, rowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-table', userId, tableName] })
      toast.success('Riga eliminata con successo')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante l\'eliminazione')
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<TableRow>) =>
      apiClient.createTableRow(userId, tableName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-table', userId, tableName] })
      toast.success('Riga creata con successo')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante la creazione')
    },
  })

  const handleEdit = (row: TableRow) => {
    setEditingRow((row as any).id)
    setEditData({ ...row })
  }

  const handleSave = () => {
    if (editingRow) {
      updateMutation.mutate({ rowId: editingRow, data: editData })
    }
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditData({})
  }

  const handleDelete = (rowId: number) => {
    if (confirm('Sei sicuro di voler eliminare questa riga?')) {
      deleteMutation.mutate(rowId)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <p className="mt-2 text-sm text-gray-500">Caricamento dati...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Errore nel caricamento della tabella</p>
        <p className="text-sm text-gray-500 mt-1">
          La tabella potrebbe non esistere ancora. Verifica che l'onboarding sia completato.
        </p>
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nessun dato disponibile</p>
        {editable && (
          <button
            onClick={() => createMutation.mutate({})}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            + Aggiungi Riga
          </button>
        )}
      </div>
    )
  }

  const columns = Object.keys(data.data[0] || {})

  return (
    <div className="space-y-4">
      {editable && (
        <div className="flex justify-end">
          <button
            onClick={() => createMutation.mutate({})}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition"
          >
            + Aggiungi Riga
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
              {editable && <th className="px-6 py-3 text-right">Azioni</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((row: any) => {
              const isEditing = editingRow === row.id
              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {isEditing && editable ? (
                        <input
                          type="text"
                          value={editData[col as keyof TableRow] || ''}
                          onChange={(e) =>
                            setEditData({ ...editData, [col]: e.target.value })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      ) : (
                        String(row[col] ?? '')
                      )}
                    </td>
                  ))}
                  {editable && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            Salva
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Annulla
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(row)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Elimina
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.total > data.limit && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {data.page * data.limit - data.limit + 1} -{' '}
            {Math.min(data.page * data.limit, data.total)} di {data.total}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Precedente
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(data.total / data.limit)}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Successiva
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
