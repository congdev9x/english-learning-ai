import { useState, useEffect } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState([]);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [navigateLoading, setNavigateLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTranscript = localStorage.getItem("transcript");
    const savedAnalysis = localStorage.getItem("flashcardData");

    if (savedTranscript) {
      setTranscript(savedTranscript);
      setFile({ name: "Đã upload trước đó" });
    }

    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis);
        setAnalysis(parsed);
      } catch (e) {
        console.warn("Cannot parse saved analysis", e);
      }
    }
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    const formData = new FormData();
    formData.append("audio", file);
    setLoading(true);

    try {
      const res = await axios.post("/upload", formData);
      setTranscript(res.data.transcript);
      localStorage.setItem("transcript", res.data.transcript);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!transcript) return;
    setAnalyzeLoading(true);
    try {
      const res = await axios.post("/process-transcript", { transcript });
      const result = res.data.data;
      setAnalysis(result);
      localStorage.setItem("flashcardData", JSON.stringify(result));
    } catch (err) {
      console.error("Analyze error:", err);
      alert("GPT error: " + err.message);
    } finally {
      setAnalyzeLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: 40,
        fontFamily: "sans-serif",
      }}
    >
      <h2>🎵 Upload Audio/Video to Learn English</h2>

      <div
        style={{
          border: "2px dashed #aaa",
          padding: 30,
          borderRadius: 10,
          textAlign: "center",
          background: "#f9f9f9",
        }}
      >
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
        />
        {file && (
          <p>
            📂 <strong>{file.name}</strong>
          </p>
        )}
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            marginTop: 10,
            padding: "10px 20px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          {loading ? "⏳ Uploading..." : "⬆️ Upload & Transcribe"}
        </button>
      </div>

      {transcript && (
        <div style={{ marginTop: 40 }}>
          <h3>📝 Transcript gốc</h3>
          <div
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 20,
              lineHeight: 1.6,
              maxHeight: 300,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "Georgia, serif",
            }}
          >
            {transcript}
          </div>
        </div>
      )}

      {(transcript || analysis.length > 0) && (
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={() => {
              localStorage.removeItem("transcript");
              localStorage.removeItem("analysis");
              localStorage.removeItem("flashcardData");
              setTranscript("");
              setAnalysis([]);
              setFile(null);
            }}
            style={{
              background: "#dc3545",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            🗑 Xóa dữ liệu đã học
          </button>
        </div>
      )}

      {transcript && (
        <div style={{ marginTop: 30, textAlign: "center" }}>
          <button
            onClick={handleAnalyze}
            disabled={analyzeLoading}
            style={{
              background: "#28a745",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 5,
              border: "none",
              cursor: analyzeLoading ? "not-allowed" : "pointer",
            }}
          >
            {analyzeLoading ? "⏳ Đang phân tích..." : "🔍 Phân tích học tập"}
          </button>
        </div>
      )}

      {analysis.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => {
                setNavigateLoading(true);
                navigate("/flashcards", { state: { data: analysis } });
              }}
              disabled={navigateLoading}
              style={{
                padding: "10px 20px",
                marginRight: 10,
                background: "#ffc107",
                color: "#000",
                border: "none",
                borderRadius: 5,
                cursor: navigateLoading ? "not-allowed" : "pointer",
              }}
            >
              {navigateLoading ? "⏳ Đang chuyển..." : "🧠 Học với Flashcard"}
            </button>

            <button
              onClick={() => {
                setNavigateLoading(true);
                navigate("/quiz", { state: { data: analysis } });
              }}
              disabled={navigateLoading}
              style={{
                padding: "10px 20px",
                background: "#17a2b8",
                color: "#fff",
                border: "none",
                borderRadius: 5,
                cursor: navigateLoading ? "not-allowed" : "pointer",
              }}
            >
              {navigateLoading ? "⏳ Đang chuyển..." : "🎯 Làm Quiz"}
            </button>
          </div>
          <h3>📊 Kết quả phân tích</h3>
          {analysis.map((item, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: 30,
                padding: 20,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 8,
              }}
            >
              <strong>🗣 {item.original}</strong>
              <p>
                🇻🇳 <b>Dịch:</b> {item.translation}
              </p>
              <p>
                📘 <b>Ngữ pháp:</b> {item.grammar}
              </p>
              {item.vocab.length > 0 && (
                <ul>
                  {item.vocab.map((v, i) => (
                    <li key={i}>
                      <strong>{v.word}</strong>: {v.meaning} —{" "}
                      <i>{v.example}</i>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
