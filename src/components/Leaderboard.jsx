import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLeaderboard, getQuiz, getQuizzes } from '../services/db.js'

export default function Leaderboard() {
  const { quizId } = useParams()

  if (quizId === 'choose') {
    const quizzes = getQuizzes()
    return (
      <div className="card">
        <h2 style={{marginTop:0}}>Choose a quiz</h2>
        <div className="row" style={{marginTop: 12}}>
          {quizzes.map(q => (
            <Link key={q.id} to={`/leaderboard/${q.id}`} className="card col">
              <h3 style={{margin:'0 0 6px 0'}}>{q.title}</h3>
              <div className="badge">{q.subject} • {q.difficulty}</div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const quiz = getQuiz(quizId)
  if (!quiz) return <div className="card">Quiz not found.</div>

  if (quiz.showLeaderboard === false) {
    return (
      <div className="card">
        <h2 style={{marginTop:0}}>Leaderboard — {quiz.title}</h2>
        <div style={{color:'var(--muted)'}}>Leaderboard is hidden by the admin for this quiz.</div>
        <div style={{marginTop:12}}><Link className="btn" to="/">Back to Quizzes</Link></div>
      </div>
    )
  }

  const rows = getLeaderboard(quizId)
  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Leaderboard — {quiz.title}</h2>
      <table className="table">
        <thead>
          <tr><th>#</th><th>Name</th><th>Score</th><th>Percent</th><th>Time (s)</th><th>Date</th></tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan="6" style={{color:'var(--muted)'}}>No attempts yet.</td></tr>}
          {rows.slice(0, 50).map((r, i) => (
            <tr key={r.id}>
              <td>{i+1}</td>
              <td>{r.userName}</td>
              <td>{r.score}/{r.total}</td>
              <td>{r.percentage}%</td>
              <td>{r.timeTakenSec}</td>
              <td>{new Date(r.attemptedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:12}}>
        <Link className="btn" to="/">Back to Quizzes</Link>
      </div>
    </div>
  )
}
