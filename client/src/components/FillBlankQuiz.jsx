import { useState, useMemo } from 'react'

function FillBlankQuiz({ item, allVocab }) {
  const [selected, setSelected] = useState(null)

  const quiz = useMemo(() => {
    // Chọn từ đầu tiên trong vocab để ẩn
    const wordToHide = item.vocab?.[0]?.word
    if (!wordToHide) return null

    const pattern = new RegExp(`\\b${wordToHide}\\b`, 'i')
    const blanked = item.original.replace(pattern, '______')

    // Tạo đáp án sai từ các từ khác
    const distractors = allVocab
      .filter(v => v.word !== wordToHide)
      .map(v => v.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    const options = [wordToHide, ...distractors].sort(() => 0.5 - Math.random())

    return {
      question: blanked,
      answer: wordToHide,
      options,
    }
  }, [item, allVocab])

  if (!quiz) return null

  const isCorrect = selected === quiz.answer

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, marginBottom: 24 }}>
      <h4>Fill in the blank:</h4>
      <p style={{ fontSize: 18, marginBottom: 12 }}>
        <strong>{quiz.question}</strong>
      </p>
      {quiz.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelected(opt)}
          style={{
            display: 'block',
            margin: '6px 0',
            padding: 8,
            width: '100%',
            background: selected === opt
              ? (isCorrect ? '#d4edda' : '#f8d7da')
              : '#f9f9f9',
            border: '1px solid #aaa',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {opt}
        </button>
      ))}
      {selected && (
        <p style={{ color: isCorrect ? 'green' : 'red' }}>
          {isCorrect ? '✅ Correct!' : `❌ Wrong. Correct: ${quiz.answer}`}
        </p>
      )}
    </div>
  )
}

export default FillBlankQuiz
