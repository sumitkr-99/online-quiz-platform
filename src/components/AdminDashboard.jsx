import React, { useMemo, useState } from 'react'
import { 
  createQuiz, deleteQuiz, getQuizzes, 
  getQuestionsByQuiz, createQuestion, deleteQuestion, 
  updateQuiz, updateQuestion, getQuizStats 
} from '../services/db.js'

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState(getQuizzes())
  const [selectedId, setSelectedId] = useState(quizzes[0]?.id || null)
  const [qForm, setQForm] = useState({ 
    title:'', subject:'', timeLimit:60, difficulty:'Easy', showLeaderboard: true 
  })
  const [questionForm, setQuestionForm] = useState({ 
    text:'', options:['','','',''], correctIndex:0, explanation:'' 
  })

  // refresh both quizzes + reset selected quiz if needed
  const refresh = () => {
    const all = getQuizzes()
    setQuizzes(all)
    if (!all.find(q => q.id === selectedId)) {
      setSelectedId(all[0]?.id || null)
    }
  }

  const selectedQuestions = useMemo(
    () => selectedId ? getQuestionsByQuiz(selectedId) : [],
    [selectedId, quizzes] // depend on quizzes so UI refreshes after changes
  )

  // --- Quiz actions ---
  const onCreateQuiz = (e) => {
    e.preventDefault()
    createQuiz(qForm)
    setQForm({ title:'', subject:'', timeLimit:60, difficulty:'Easy', showLeaderboard: true })
    refresh()
  }

  const onDeleteQuiz = (id) => {
    if (!confirm('Delete this quiz and all its questions?')) return
    deleteQuiz(id)
    refresh()
  }

  const onUpdateQuiz = (id, patch) => { updateQuiz(id, patch); refresh() }

  // --- Question actions ---
  const onAddQuestion = (e) => {
    e.preventDefault()
    if (!selectedId) return alert('Select a quiz first')
    const optsTrimmed = questionForm.options.map(o => o.trim())
    if (optsTrimmed.some(o => o.length === 0)) return alert('All 4 options are required')
    createQuestion({ 
      quizId: selectedId, 
      text: questionForm.text, 
      options: optsTrimmed, 
      correctIndex: questionForm.correctIndex, 
      explanation: questionForm.explanation 
    })
    setQuestionForm({ text:'', options:['','','',''], correctIndex:0, explanation:'' })
    refresh()
  }

  const onDeleteQuestion = (id) => { deleteQuestion(id); refresh() }
  const onUpdateQuestion = (id, patch) => { updateQuestion(id, patch); refresh() }

  const stats = selectedId ? getQuizStats(selectedId) : null

  return (
    <div className="row">
      {/* Left: Quizzes */}
      <div className="card col" style={{minWidth: 320}}>
        <h2 style={{marginTop:0}}>Quizzes</h2>
        <form onSubmit={onCreateQuiz} className="card" style={{marginBottom:12}}>
          <div className="field"><label>Title</label>
            <input value={qForm.title} onChange={e=>setQForm({...qForm, title:e.target.value})} required/>
          </div>
          <div className="field"><label>Subject</label>
            <input value={qForm.subject} onChange={e=>setQForm({...qForm, subject:e.target.value})} required/>
          </div>
          <div className="field"><label>Time Limit (seconds)</label>
            <input type="number" min="10" value={qForm.timeLimit} onChange={e=>setQForm({...qForm, timeLimit:e.target.value})} required/>
          </div>
          <div className="field">
            <label>Difficulty</label>
            <select value={qForm.difficulty} onChange={e=>setQForm({...qForm, difficulty:e.target.value})}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
          <div className="field">
            <label>
              <input type="checkbox" checked={qForm.showLeaderboard} 
                     onChange={e=>setQForm({...qForm, showLeaderboard:e.target.checked})}/> 
              Show Leaderboard
            </label>
          </div>
          <button className="btn primary" type="submit">Create Quiz</button>
        </form>

        {quizzes.length === 0 && <p style={{color:'var(--muted)'}}>No quizzes yet. Create one above.</p>}

        {quizzes.length > 0 && (
          <table className="table">
            <thead><tr><th>Title</th><th>Time</th><th>Diff</th><th></th></tr></thead>
            <tbody>
              {quizzes.map(z => (
                <tr key={z.id} 
                    style={{cursor:'pointer', background: selectedId===z.id?'#11193d':'transparent'}} 
                    onClick={()=>setSelectedId(z.id)}>
                  <td>
                    <strong contentEditable suppressContentEditableWarning
                      onBlur={e=>onUpdateQuiz(z.id, { title: e.target.textContent })}>
                      {z.title}
                    </strong>
                    <div style={{color:'var(--muted)', fontSize:12}}>{z.subject}</div>
                  </td>
                  <td>
                    <span contentEditable suppressContentEditableWarning 
                      onBlur={e=>onUpdateQuiz(z.id, { timeLimit: Number(e.target.textContent) || 0 })}>
                      {z.timeLimit}
                    </span>s
                  </td>
                  <td>
                    <select value={z.difficulty} onChange={e=>onUpdateQuiz(z.id, { difficulty: e.target.value })}>
                      <option>Easy</option><option>Medium</option><option>Hard</option>
                    </select>
                    <div style={{marginTop:6}}>
                      <label style={{fontSize:12, color:'var(--muted)'}}>
                        <input type="checkbox" checked={z.showLeaderboard} 
                               onChange={e=>onUpdateQuiz(z.id, { showLeaderboard: e.target.checked })}/> 
                        Show Leaderboard
                      </label>
                    </div>
                  </td>
                  <td>
                    <button className="btn danger" 
                      onClick={(ev)=>{ev.stopPropagation(); onDeleteQuiz(z.id)}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Middle: Questions */}
      <div className="card col">
        <h2 style={{marginTop:0}}>Questions {selectedId ? '' : '(select a quiz)'}</h2>
        {selectedId ? (
          <>
            <form onSubmit={onAddQuestion} className="card" style={{marginBottom:12}}>
              <div className="field"><label>Question</label>
                <textarea rows="2" value={questionForm.text} 
                  onChange={e=>setQuestionForm({...questionForm, text:e.target.value})} required/>
              </div>
              <div className="row">
                {[0,1,2,3].map(i => (
                  <div key={i} className="col">
                    <div className="field"><label>Option {i+1}</label>
                      <input value={questionForm.options[i]} 
                        onChange={e=>{
                          const copy = [...questionForm.options]; copy[i]=e.target.value; 
                          setQuestionForm({...questionForm, options:copy})
                        }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="row" style={{alignItems:'center'}}>
                <div className="field" style={{flex:'0 0 180px'}}>
                  <label>Correct Index (0-3)</label>
                  <input type="number" min="0" max="3" value={questionForm.correctIndex} 
                    onChange={e=>setQuestionForm({...questionForm, correctIndex:Number(e.target.value)})} />
                </div>
                <div className="field" style={{flex:1}}>
                  <label>Explanation (optional)</label>
                  <input value={questionForm.explanation} 
                    onChange={e=>setQuestionForm({...questionForm, explanation:e.target.value})} />
                </div>
                <button className="btn primary" type="submit" style={{height:40, alignSelf:'end'}}>Add</button>
              </div>
            </form>

            <table className="table">
              <thead><tr><th>Question</th><th>Options</th><th>Answer</th><th></th></tr></thead>
              <tbody>
                {selectedQuestions.map(qq => (
                  <tr key={qq.id}>
                    <td>
                      <div contentEditable suppressContentEditableWarning
                        onBlur={e=>onUpdateQuestion(qq.id, { text: e.target.textContent })}>
                        {qq.text}
                      </div>
                      {qq.explanation && (
                        <div style={{color:'var(--muted)', fontSize:12, marginTop:6}}>ℹ {qq.explanation}</div>
                      )}
                    </td>
                    <td>
                      <ol type="A" style={{margin:0, paddingLeft:16}}>
                        {qq.options.map((o, i) => (
                          <li key={i}>
                            <span contentEditable suppressContentEditableWarning
                              onBlur={e=>{
                                const op = [...qq.options]; op[i] = e.target.textContent; 
                                onUpdateQuestion(qq.id, { options: op })
                              }}>
                              {o}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </td>
                    <td>
                      <input type="number" min="0" max="3" value={qq.correctIndex} 
                        onChange={e=>onUpdateQuestion(qq.id, { correctIndex: Number(e.target.value) })} style={{width:60}}/>
                    </td>
                    <td>
                      <button className="btn danger" onClick={()=>onDeleteQuestion(qq.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p style={{color:'var(--muted)'}}>Please select a quiz to manage its questions.</p>
        )}
      </div>

      {/* Right: Stats */}
      {selectedId && stats && (
        <div className="card col" style={{minWidth: 300}}>
          <h2 style={{marginTop:0}}>Quiz Stats</h2>
          <p><strong>Average Score:</strong> {stats.avgScore.toFixed(2)}</p>
          <p><strong>Total Attempts:</strong> {stats.attempts}</p>
          <div style={{marginTop:8}}>
            <strong>Most Missed Question:</strong>
            <div style={{marginTop:6, color:'var(--muted)'}}>
              {stats.mostMissed ? (selectedQuestions.find(q=>q.id === stats.mostMissed)?.text || 'Question removed') : '—'}
            </div>
          </div>

          <div style={{marginTop:12}}>
            <h4 style={{margin:'8px 0'}}>Miss counts</h4>
            {Object.keys(stats.questionMissCounts).length === 0 && <div style={{color:'var(--muted)'}}>No misses yet</div>}
            {Object.entries(stats.questionMissCounts).map(([qid,count]) => (
              <div key={qid} style={{marginTop:6}}>
                <div style={{fontSize:13}}>{selectedQuestions.find(q=>q.id === qid)?.text || '—'}</div>
                <div className="badge">Missed {count} times</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
