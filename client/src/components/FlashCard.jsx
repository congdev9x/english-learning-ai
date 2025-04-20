import { useState } from "react";

import "./Flashcard.css"; // 👉 import file CSS riêng


function Flashcard({ word, meaning, example }) {
  const [flipped, setFlipped] = useState(false);

  const speakWord = () => {
    const utter = new SpeechSynthesisUtterance(word)
    utter.lang = "en-US"
    window.speechSynthesis.speak(utter)
  }

  return (
    <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>
        <div className="front">
          <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {word}
            <button
              onClick={(e) => {
                e.stopPropagation() // tránh lật thẻ khi click
                speakWord()
              }}
              className="speak-button"
              title="Nghe phát âm"
            >
              🔊
            </button>
          </h2>
        </div>
        <div className="back">
          <h3>{meaning}</h3>
          <p><i>{example}</i></p>
        </div>
      </div>
    </div>
  )
}

export default Flashcard;