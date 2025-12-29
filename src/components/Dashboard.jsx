import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { getQuizzes } from "../services/db.js"
import { useAuth } from "../context/AuthContext.jsx"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const quizzes = Array.isArray(getQuizzes()) ? getQuizzes() : []

  const onStart = (id) => {
    if (!user) return navigate("/login")
    navigate(`/quiz/${id}`)
  }

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2 style={{ margin: 0 }}>Available Quizzes</h2>
        <span className="badge">Total {quizzes.length}</span>
      </div>

      <div className="row" style={{ marginTop: 12 }}>
        {quizzes.map((q) => (
          <div key={q.id} className="card col">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 6,
              }}
            >
              <h3 style={{ margin: "0 0 6px 0" }}>{q.title}</h3>
              <span className="badge">{q.difficulty}</span>
            </div>

            <p style={{ marginTop: 0, color: "var(--muted)" }}>{q.subject}</p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="badge">Time: {q.timeLimit}s</span>
              <Link className="badge" to={`/leaderboard/${q.id}`}>
                Leaderboard
              </Link>
            </div>

            <div style={{ marginTop: 12 }}>
              <button
                className="btn primary"
                onClick={() => onStart(q.id)}
              >
                Start Quiz
              </button>
            </div>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <p style={{ color: "var(--muted)" }}>
          No quizzes yet. Admins can create one in the Admin panel.
        </p>
      )}
    </div>
  )
}
