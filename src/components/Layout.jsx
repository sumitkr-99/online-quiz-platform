import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation()
  const onLogout = () => { logout(); navigate('/login') }

  return (
    <div>
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand">
            <span className="brand-dot" />
            <Link to="/" style={{fontSize: 18}}>Quiz<span style={{color:'#4df4c1'}}>Sphere</span></Link>
          </div>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <Link to="/" className="badge">Home</Link>
            <Link to="/leaderboard/choose" className="badge">Leaderboard</Link>
            {user?.role === 'admin' && <Link to="/admin" className="badge">Admin</Link>}
            {user ? (
              <>
                <span className="badge">{user.name} ({user.role})</span>
                <button className="btn" onClick={onLogout}>Logout</button>
              </>
            ) : (
              loc.pathname !== '/login' && <Link to="/login" className="btn">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="container">{children}</main>
    </div>
  )
}
