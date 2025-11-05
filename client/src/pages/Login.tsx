import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/dashboard'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="section-title">Welcome back</h1>
        <p className="subtle">Sign in to manage your schedule and swaps</p>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn-primary w-full">Login</button>
          </form>
          <div className="text-sm mt-3">No account? <Link className="text-blue-600" to="/signup">Sign up</Link></div>
        </div>
      </div>
    </div>
  )
}

