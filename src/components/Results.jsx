import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getAttempt, getQuestionsByQuiz, getQuiz } from '../services/db.js'

export default function Results() {
  const { attemptId } = useParams()
  const attempt = getAttempt(attemptId)
  if (!attempt) return <div className="card">Attempt not found.</div>
  const quiz = getQuiz(attempt.quizId)
  if (!quiz) return <div className='card'>Quiz not found.</div>
  const questions = getQuestionsByQuiz(quiz.id)

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>Results — {quiz.title}</h2>
      <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
        <span className="badge">Score: {attempt.score}/{attempt.total}</span>
        <span className="badge">Percent: {attempt.percentage}%</span>
        <span className="badge">Time: {attempt.timeTakenSec}s</span>
        <Link to={`/leaderboard/${quiz.id}`} className="badge">View Leaderboard</Link>
      </div>

      <div className="card" style={{marginTop:16}}>
        <table className="table">
          <thead><tr><th>#</th><th>Question</th><th>Your Answer</th><th>Correct Answer</th><th>Status</th></tr></thead>
          <tbody>
            {questions.map((q, i) => {
              const ans = attempt.answers.find(a => a.questionId === q.id)
              const chosen = ans?.chosenIndex ?? null
              const status = ans?.correct ? 'Correct' : (chosen===null ? 'Unanswered' : 'Wrong')
              return (
                <tr key={q.id} style={{background: ans?.correct ? 'rgba(77,244,193,0.08)' : 'rgba(255,107,107,0.08)'}}>
                  <td>{i+1}</td>
                  <td>
                    <div style={{marginBottom:6}}>{q.text}</div>
                    {q.explanation && <div style={{color:'var(--muted)', fontSize:12}}>ℹ {q.explanation}</div>}
                  </td>
                  <td>{chosen !== null ? `${String.fromCharCode(65+chosen)}. ${q.options[chosen]}` : '—'}</td>
                  <td>{`${String.fromCharCode(65+q.correctIndex)}. ${q.options[q.correctIndex]}`}</td>
                  <td>{status}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{marginTop:12}}>
        <Link className="btn" to="/">Back to Quizzes</Link>
      </div>
    </div>
  )
}
