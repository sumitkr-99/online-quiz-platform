import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login, register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [mode, setMode] = useState('login') // login | register
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      let u
      if (mode === 'login') {
        u = login(form.email, form.password)
      } else {
        u = register(form)
      }

      // 🚀 Redirect based on role
      if (u.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="card" style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={onSubmit} className="col">
        {mode === 'register' && (
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn primary" type="submit">
          {mode === 'login' ? 'Login' : 'Register'}
        </button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
      <div style={{ marginTop: 12 }}>
        {mode === 'login' ? (
          <span>
            Don&apos;t have an account?{' '}
            <button className="link" onClick={() => setMode('register')}>
              Register
            </button>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <button className="link" onClick={() => setMode('login')}>
              Login
            </button>
          </span>
        )}
      </div>
    </div>
  )
}
