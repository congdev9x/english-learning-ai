import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import TranslateQuiz from "../components/TranslateQuiz";

function TranslateQuizPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const data =
    state?.data || JSON.parse(localStorage.getItem("flashcardData") || "[]");
  const translations = data.map((item) => item.translation).filter(Boolean);

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
      <h2>📘 Translation Quiz</h2>
      {data.map((item, i) => (
        <TranslateQuiz key={i} item={item} allTranslations={translations} />
      ))}
    </div>
  );
}

export default TranslateQuizPage;
