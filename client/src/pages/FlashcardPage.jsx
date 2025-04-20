import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Flashcard from "../components/FlashCard";

function FlashcardPage() {
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

      <h2>🧠 Flashcard học từ vựng</h2>

      <div style={{ display: "flex", flexWrap: "wrap", padding: 20 }}>
        {vocabList.map((v, i) => (
          <Flashcard key={i} {...v} />
        ))}
      </div>
    </div>
  );
}

export default FlashcardPage;
