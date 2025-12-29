import React, { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { seedIfEmpty } from '../services/db.js'

const AuthContext = createContext()

function getUsers() {
  const raw = localStorage.getItem('users')
  if (raw) return JSON.parse(raw)
  // seed default users
  const seeded = [
    { id: uuidv4(), email: 'admin@demo.com', password: 'admin123', name: 'Demo Admin', role: 'admin' },
    { id: uuidv4(), email: 'user@demo.com', password: 'user123', name: 'Demo User', role: 'user' }
  ]
  localStorage.setItem('users', JSON.stringify(seeded))
  return seeded
}

function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // seed DB on first load
    seedIfEmpty()
    // restore session
    const raw = localStorage.getItem('sessionUser')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const login = (email, password) => {
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    setUser(found)
    localStorage.setItem('sessionUser', JSON.stringify(found))
    return found
  }

  const register = ({ name, email, password, role = 'user' }) => {
    const users = getUsers()
    if (users.some(u => u.email === email)) throw new Error('Email already exists')
    const newUser = { id: uuidv4(), name, email, password, role }
    users.push(newUser)
    setUsers(users)
    setUser(newUser)
    localStorage.setItem('sessionUser', JSON.stringify(newUser))
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('sessionUser')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
