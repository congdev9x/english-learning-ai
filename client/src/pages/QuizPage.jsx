import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import VocabQuiz from "../components/VocabQuiz";

function QuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const data =
    state?.data || JSON.parse(localStorage.getItem("flashcardData") || "[]");
  const vocabList = Array.isArray(data)
    ? data.flatMap((item) => item.vocab || [])
    : [];

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: 20,
          padding: "6px 12px",
          background: "#ddd",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
        }}
      >
        ⬅️ Quay lại
      </button>
      <h2>🎯 Vocabulary Quiz</h2>
      {vocabList.map((vocab, i) => (
        <VocabQuiz key={i} vocab={vocab} allVocab={vocabList} />
      ))}
    </div>
  );
}

export default QuizPage;
