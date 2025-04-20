import { useState, useMemo } from 'react'

function TranslateQuiz({ item, allTranslations }) {
  const [selected, setSelected] = useState(null)

  const quiz = useMemo(() => {
    const correct = item.translation

    // Sinh 3 bản dịch sai từ các câu khác
    const others = allTranslations
      .filter(t => t !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    const options = [correct, ...others].sort(() => 0.5 - Math.random())

    return {
      question: item.original,
      answer: correct,
      options,
    }
  }, [item, allTranslations])

  const isCorrect = selected === quiz.answer

  return (
    <div style={{ border: '1px solid #ccc', padding: 20, marginBottom: 24 }}>
      <h4>🈯 Dịch câu sau sang tiếng Việt:</h4>
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
          {isCorrect ? '✅ Đúng rồi!' : `❌ Sai. Đáp án đúng: ${quiz.answer}`}
        </p>
      )}
    </div>
  )
}

export default TranslateQuiz
