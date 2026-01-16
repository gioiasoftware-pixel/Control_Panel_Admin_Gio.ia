import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserDetail from './pages/UserDetail'
import UserEdit from './pages/UserEdit'
import FileManager from './pages/FileManager'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const { isAuthenticated, hasHydrated } = useAuthStore()

  if (!hasHydrated) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/admin/login" element={
            isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />
          } />
          <Route path="/admin" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users/:userId" element={<UserDetail />} />
            <Route path="users/:userId/edit" element={<UserEdit />} />
            <Route path="files" element={<FileManager />} />
          </Route>
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/admin/login" replace />
          } />
          <Route path="*" element={
            isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/admin/login" replace />
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
