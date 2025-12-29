import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getQuiz, getQuestionsByQuiz, recordAttempt } from '../services/db.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function QuizAttempt() {
  const { quizId } = useParams()
  const quiz = getQuiz(quizId)
  const questions = useMemo(() => getQuestionsByQuiz(quizId), [quizId])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [remaining, setRemaining] = useState(quiz?.timeLimit || 60)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const timerRef = useRef(null)

  useEffect(() => {
    if (!quiz) return
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(timerRef.current)
          onSubmit(true)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId])

  if (!quiz) return <div className="card">Quiz not found.</div>
  if (!user) return <div className="card">You must be logged in to attempt this quiz.</div>
  if (questions.length === 0) return <div className="card">No questions in this quiz yet.</div>

  const current = questions[idx]

  const selectAnswer = (qid, optionIndex) => {
    setAnswers(a => ({ ...a, [qid]: optionIndex }))
  }

  const onSubmit = (auto = false) => {
    if (submitted) return
    setSubmitted(true)
    const timeTakenSec = (quiz.timeLimit - remaining) >= 0 ? (quiz.timeLimit - remaining) : quiz.timeLimit
    const attempt = recordAttempt({ quizId, user, answers, timeTakenSec })
    navigate(`/results/${attempt.id}`, { state: { attemptId: attempt.id, auto } })
  }

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h2 style={{margin:'0 0 6px 0'}}>{quiz.title}</h2>
          <div className="badge">{quiz.subject} • {quiz.difficulty}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="badge">Time Remaining</div>
          <div style={{fontSize:28, fontWeight:800}}>{remaining}s</div>
        </div>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div className="badge">Question {idx+1} / {questions.length}</div>
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}>Prev</button>
            {idx < questions.length - 1 ? (
              <button className="btn" onClick={()=>setIdx(i=>Math.min(questions.length-1,i+1))}>Next</button>
            ) : (
              <button className="btn primary" onClick={()=>onSubmit(false)}>Submit</button>
            )}
          </div>
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontSize:18, marginBottom:12}}>{current.text}</div>
          <div className="row">
            {current.options.map((opt, i) => {
              const chosen = answers[current.id] === i
              return (
                <label key={i} className="card col" style={{cursor:'pointer', borderColor: chosen ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}}>
                  <input type="radio" name={current.id} checked={chosen} onChange={()=>selectAnswer(current.id, i)} style={{display:'none'}}/>
                  <div style={{display:'flex', gap:10, alignItems:'center'}}>
                    <div className="badge">Option {String.fromCharCode(65+i)}</div>
                    <div>{opt}</div>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
