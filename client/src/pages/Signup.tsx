import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const { signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await signup(name, email, password)
      navigate('/dashboard')
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="section-title">Create your account</h1>
        <p className="subtle">Join SlotSwapper in a few seconds</p>
      </div>
      <div className="card">
        <div className="card-body">
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn-primary w-full">Create account</button>
          </form>
          <div className="text-sm mt-3">Have an account? <Link className="text-blue-600" to="/login">Login</Link></div>
        </div>
      </div>
    </div>
  )
}

