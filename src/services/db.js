import { v4 as uuidv4 } from 'uuid'

const KEYS = {
  quizzes: 'quizzes',
  questions: 'questions',
  attempts: 'attempts',
}

function read(key) {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : []
}

function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export function seedIfEmpty() {
  const quizzes = read(KEYS.quizzes)
  const questions = read(KEYS.questions)

  if (quizzes.length === 0 && questions.length === 0) {
    const now = new Date().toISOString()

    // --- Create quizzes ---
    const quizGeneral = { id: uuidv4(), title: 'General Knowledge', subject: 'Trivia', timeLimit: 60, difficulty: 'Easy', showLeaderboard: true, createdAt: now }
    const quizScience = { id: uuidv4(), title: 'Science', subject: 'STEM', timeLimit: 90, difficulty: 'Medium', showLeaderboard: true, createdAt: now }
    const quizHistory = { id: uuidv4(), title: 'History', subject: 'Social Studies', timeLimit: 90, difficulty: 'Medium', showLeaderboard: true, createdAt: now }
    const quizTech = { id: uuidv4(), title: 'Technology', subject: 'Computers', timeLimit: 120, difficulty: 'Hard', showLeaderboard: true, createdAt: now }

    const seedQuizzes = [quizGeneral, quizScience, quizHistory, quizTech]

    // --- Create questions ---
    const seedQuestions = [
      // General Knowledge
      {
        id: uuidv4(),
        quizId: quizGeneral.id,
        text: 'What is the capital of France?',
        options: ['Paris', 'London', 'Rome', 'Berlin'],
        correctIndex: 0,
        explanation: 'Paris is the capital of France.',
      },
      {
        id: uuidv4(),
        quizId: quizGeneral.id,
        text: 'Which is the largest ocean on Earth?',
        options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
        correctIndex: 2,
        explanation: 'The Pacific Ocean is the largest.',
      },
      {
        id: uuidv4(),
        quizId: quizGeneral.id,
        text: 'What is the currency of Japan?',
        options: ['Yuan', 'Won', 'Yen', 'Ringgit'],
        correctIndex: 2,
        explanation: 'Japan uses the Yen.',
      },
      {
        id: uuidv4(),
        quizId: quizGeneral.id,
        text: 'Which continent is the Sahara Desert located on?',
        options: ['Asia', 'South America', 'Africa', 'Australia'],
        correctIndex: 2,
        explanation: 'The Sahara Desert is in northern Africa.',
      },
      {
        id: uuidv4(),
        quizId: quizGeneral.id,
        text: 'Who painted the Mona Lisa?',
        options: ['Michelangelo', 'Leonardo da Vinci', 'Picasso', 'Rembrandt'],
        correctIndex: 1,
        explanation: 'Leonardo da Vinci painted the Mona Lisa.',
      },

      // Science
      {
        id: uuidv4(),
        quizId: quizScience.id,
        text: 'Which planet is known as the Red Planet?',
        options: ['Mars', 'Venus', 'Jupiter', 'Saturn'],
        correctIndex: 0,
        explanation: 'Mars is called the Red Planet.',
      },
      {
        id: uuidv4(),
        quizId: quizScience.id,
        text: 'What is the speed of light?',
        options: ['300,000 km/s', '150,000 km/s', '3,000 km/s', '30,000 km/s'],
        correctIndex: 0,
        explanation: 'The speed of light is ~300,000 km/s.',
      },
      {
        id: uuidv4(),
        quizId: quizScience.id,
        text: 'Which part of the cell contains genetic material?',
        options: ['Nucleus', 'Cytoplasm', 'Cell Wall', 'Mitochondria'],
        correctIndex: 0,
        explanation: 'DNA is stored in the nucleus.',
      },
      {
        id: uuidv4(),
        quizId: quizScience.id,
        text: 'What gas do humans exhale?',
        options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
        correctIndex: 2,
        explanation: 'Humans exhale carbon dioxide.',
      },
      {
        id: uuidv4(),
        quizId: quizScience.id,
        text: 'Which element has the chemical symbol O?',
        options: ['Osmium', 'Oxygen', 'Oganesson', 'Oxide'],
        correctIndex: 1,
        explanation: 'O stands for Oxygen.',
      },

      // History
      {
        id: uuidv4(),
        quizId: quizHistory.id,
        text: 'In which year did World War II end?',
        options: ['1942', '1945', '1948', '1950'],
        correctIndex: 1,
        explanation: 'World War II ended in 1945.',
      },
      {
        id: uuidv4(),
        quizId: quizHistory.id,
        text: 'Who was the first President of the United States?',
        options: ['Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams'],
        correctIndex: 2,
        explanation: 'George Washington was the first US President.',
      },
      {
        id: uuidv4(),
        quizId: quizHistory.id,
        text: 'The Great Wall of China was primarily built to protect against which group?',
        options: ['Romans', 'Mongols', 'Turks', 'Vikings'],
        correctIndex: 1,
        explanation: 'It was built mainly to defend against Mongols.',
      },
      {
        id: uuidv4(),
        quizId: quizHistory.id,
        text: 'Who was known as the Maid of Orléans?',
        options: ['Cleopatra', 'Joan of Arc', 'Queen Victoria', 'Marie Curie'],
        correctIndex: 1,
        explanation: 'Joan of Arc was known as the Maid of Orléans.',
      },
      {
        id: uuidv4(),
        quizId: quizHistory.id,
        text: 'Where was the ancient city of Troy located?',
        options: ['Greece', 'Italy', 'Turkey', 'Egypt'],
        correctIndex: 2,
        explanation: 'Troy was located in modern-day Turkey.',
      },

      // Technology
      {
        id: uuidv4(),
        quizId: quizTech.id,
        text: 'Who is known as the father of the computer?',
        options: ['Alan Turing', 'Charles Babbage', 'John von Neumann', 'Bill Gates'],
        correctIndex: 1,
        explanation: 'Charles Babbage is called the father of the computer.',
      },
      {
        id: uuidv4(),
        quizId: quizTech.id,
        text: 'What does HTTP stand for?',
        options: ['HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'Hyper Transfer Text Process', 'Hyperlink Transfer Process'],
        correctIndex: 0,
        explanation: 'HTTP = HyperText Transfer Protocol.',
      },
      {
        id: uuidv4(),
        quizId: quizTech.id,
        text: 'Which programming language is primarily used for iOS app development?',
        options: ['Java', 'Swift', 'Python', 'C++'],
        correctIndex: 1,
        explanation: 'Swift is Apple’s primary language for iOS apps.',
      },
      {
        id: uuidv4(),
        quizId: quizTech.id,
        text: 'What year was the World Wide Web invented?',
        options: ['1989', '1995', '1975', '2000'],
        correctIndex: 0,
        explanation: 'Tim Berners-Lee invented the WWW in 1989.',
      },
      {
        id: uuidv4(),
        quizId: quizTech.id,
        text: 'Which company developed the Android OS?',
        options: ['Microsoft', 'Google', 'Apple', 'IBM'],
        correctIndex: 1,
        explanation: 'Google develops Android.',
      },
    ]

    write(KEYS.quizzes, seedQuizzes)
    write(KEYS.questions, seedQuestions)
    write(KEYS.attempts, [])
  }
}

// --- Existing CRUD functions remain unchanged ---
export function getQuizzes() { return read(KEYS.quizzes) }
export function getQuiz(id) { return read(KEYS.quizzes).find(q => q.id === id) }
export function createQuiz({ title, subject, timeLimit, difficulty, showLeaderboard = true }) {
  const quizzes = read(KEYS.quizzes)
  const quiz = { id: uuidv4(), title, subject, timeLimit: Number(timeLimit), difficulty, showLeaderboard, createdAt: new Date().toISOString() }
  quizzes.push(quiz); write(KEYS.quizzes, quizzes); return quiz
}
export function updateQuiz(id, patch) {
  const quizzes = read(KEYS.quizzes).map(q => q.id === id ? { ...q, ...patch } : q)
  write(KEYS.quizzes, quizzes)
  return quizzes.find(q => q.id === id)
}
export function deleteQuiz(id) {
  write(KEYS.quizzes, read(KEYS.quizzes).filter(q => q.id !== id))
  write(KEYS.questions, read(KEYS.questions).filter(qq => qq.quizId !== id))
}

export function getQuestionsByQuiz(quizId) { return read(KEYS.questions).filter(q => q.quizId === quizId) }
export function createQuestion({ quizId, text, options, correctIndex, explanation }) {
  const questions = read(KEYS.questions)
  const q = { id: uuidv4(), quizId, text, options, correctIndex: Number(correctIndex), explanation }
  questions.push(q); write(KEYS.questions, questions); return q
}
export function updateQuestion(id, patch) {
  const qs = read(KEYS.questions).map(q => q.id === id ? { ...q, ...patch } : q)
  write(KEYS.questions, qs); return qs.find(q => q.id === id)
}
export function deleteQuestion(id) { write(KEYS.questions, read(KEYS.questions).filter(q => q.id !== id)) }

// Attempts & Leaderboard (unchanged)
export function recordAttempt({ quizId, user, answers, timeTakenSec }) {
  const quiz = getQuiz(quizId)
  const questions = getQuestionsByQuiz(quizId)
  let score = 0
  const detailed = questions.map(q => {
    const chosenIndex = answers[q.id] ?? null
    const correct = chosenIndex === q.correctIndex
    if (correct) score += 1
    return { questionId: q.id, chosenIndex, correct }
  })
  const total = questions.length
  const percentage = total ? Math.round((score / total) * 100) : 0
  const attempt = {
    id: uuidv4(),
    quizId,
    userId: user.id,
    userName: user.name,
    score, total, percentage,
    timeTakenSec,
    answers: detailed,
    attemptedAt: new Date().toISOString()
  }
  const attempts = read(KEYS.attempts)
  attempts.push(attempt); write(KEYS.attempts, attempts)
  return attempt
}

export function getAttemptsByQuiz(quizId) { return read(KEYS.attempts).filter(a => a.quizId === quizId) }
export function getAttemptsByUser(userId) { return read(KEYS.attempts).filter(a => a.userId === userId) }
export function getAttempt(id) { return read(KEYS.attempts).find(a => a.id === id) }
export function getLeaderboard(quizId) {
  return getAttemptsByQuiz(quizId)
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.timeTakenSec - b.timeTakenSec))
}

export function getQuizStats(quizId) {
  const attempts = getAttemptsByQuiz(quizId)
  if (attempts.length === 0) {
    return { avgScore: 0, attempts: 0, mostMissed: null, questionMissCounts: {} }
  }
  const totalScore = attempts.reduce((s, a) => s + a.score, 0)
  const avgScore = totalScore / attempts.length
  const missCounts = {}
  attempts.forEach(a => {
    a.answers.forEach(ans => {
      if (!ans.correct) {
        missCounts[ans.questionId] = (missCounts[ans.questionId] || 0) + 1
      }
    })
  })
  let mostMissed = null, max = 0
  for (const qid in missCounts) {
    if (missCounts[qid] > max) {
      max = missCounts[qid]
      mostMissed = qid
    }
  }
  return { avgScore, attempts: attempts.length, mostMissed, questionMissCounts: missCounts }
}
