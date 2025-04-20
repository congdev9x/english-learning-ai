import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import FillBlankQuiz from "../components/FillBlankQuiz";

function QuizFillBlankPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const data =
    state?.data || JSON.parse(localStorage.getItem("flashcardData") || "[]");
  const allVocab = data.flatMap((item) => item.vocab || []);

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
      <h2>✏️ Fill in the Blank Quiz</h2>
      {data.map((item, i) => (
        <FillBlankQuiz key={i} item={item} allVocab={allVocab} />
      ))}
    </div>
  );
}

export default QuizFillBlankPage;
