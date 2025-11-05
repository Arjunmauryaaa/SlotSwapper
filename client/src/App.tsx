import { Route, Routes, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Requests from './pages/Requests'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './contexts/AuthContext'

export default function App() {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <nav className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <div className="container-page py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-semibold tracking-tight">SlotSwapper</Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                <Link className="nav-link" to="/marketplace">Marketplace</Link>
                <Link className="nav-link" to="/requests">Requests</Link>
                <button onClick={logout} className="btn-ghost">Logout</button>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">Login</Link>
                <Link className="btn-primary" to="/signup">Signup</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="container-page py-6">
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<PrivateRoute />}> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/requests" element={<Requests />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

