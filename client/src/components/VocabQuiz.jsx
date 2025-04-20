import { useState, useMemo } from "react";

function VocabQuiz({ vocab, allVocab }) {
  const [selected, setSelected] = useState(null);

  // ✅ Sinh distractors từ các từ khác
  const distractors = useMemo(() => {
    const others = allVocab.filter((v) => v.word !== vocab.word && v.meaning);
    const shuffled = others.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((v) => v.meaning);
  }, [vocab, allVocab]);

  const options = useMemo(() => {
    const all = [vocab.meaning, ...distractors];
    return all.sort(() => 0.5 - Math.random());
  }, [distractors, vocab.meaning]);

  const isCorrect = selected === vocab.meaning;

  return (
    <div style={{ border: "1px solid #ddd", padding: 20, marginBottom: 20 }}>
      <h3>
        What does <strong>{vocab.word}</strong> mean?
      </h3>
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelected(opt)}
          style={{
            display: "block",
            margin: "8px 0",
            padding: 8,
            width: "100%",
            background:
              selected === opt
                ? isCorrect
                  ? "#d4edda"
                  : "#f8d7da"
                : "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {opt}
        </button>
      ))}
      {selected && (
        <p style={{ color: isCorrect ? "green" : "red" }}>
          {isCorrect ? "✅ Correct!" : "❌ Wrong"}
        </p>
      )}
    </div>
  );
}

export default VocabQuiz;
