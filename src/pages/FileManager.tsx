import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../services/api'
import { AdminFile } from '../types'
import toast from 'react-hot-toast'

export default function FileManager() {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>()
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const queryClient = useQueryClient()

  const { data: files, isLoading } = useQuery({
    queryKey: ['files', selectedUserId],
    queryFn: () => apiClient.getFiles(selectedUserId),
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file, userId }: { file: File; userId: number }) =>
      apiClient.uploadFile(file, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      setUploadFile(null)
      toast.success('File caricato con successo')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante il caricamento')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (fileId: number) => apiClient.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      toast.success('File eliminato con successo')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Errore durante l\'eliminazione')
    },
  })

  const handleDownload = async (file: AdminFile) => {
    try {
      const blob = await apiClient.downloadFile(file.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.file_name
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Download avviato')
    } catch (error: any) {
      toast.error(error.message || 'Errore durante il download')
    }
  }

  const handleUpload = () => {
    if (!uploadFile || !selectedUserId) {
      toast.error('Seleziona un file e un utente')
      return
    }
    uploadMutation.mutate({ file: uploadFile, userId: selectedUserId })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestisci i file degli utenti
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Carica Nuovo File
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="number"
              value={selectedUserId || ''}
              onChange={(e) =>
                setSelectedUserId(e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="Inserisci User ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File
            </label>
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={!uploadFile || !selectedUserId || uploadMutation.isPending}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? 'Caricamento...' : 'Carica File'}
          </button>
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">File Caricati</h2>
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-500">Caricamento file...</p>
          </div>
        ) : !files || files.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nessun file disponibile</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nome File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dimensione
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data Upload
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {file.file_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.file_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.file_size_bytes)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.uploaded_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDownload(file)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Sei sicuro di voler eliminare questo file?')) {
                              deleteMutation.mutate(file.id)
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
